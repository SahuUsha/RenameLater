
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, getPublishIdfromCloudinary, uploadOnClodinary } from "../utils/cloudinary.js";
import {Video}  from "../models/video.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";


import { parse } from "dotenv";


const getAllVideos = asyncHandler(async(req,res)=>{
    const {page = 1 , limit = 10 , query , sortBy ="createdAt", sortType ,userId} = req.query
    console.log(req.query)


    const videolimit = parseInt(limit);
    const pageSkip = (page-1)*videolimit
    const sortStage ={};
    sortStage[sortBy] = sortType === 'asc' ? 1: -1;

    const AllVideo = await Video.aggregate([
        {
            $match :{
                isPublished : true,

                // ...(query &&{ title : {$regex : query , $option : "i"}} ),
                // ...(userId && {owner : mongoose.Types.ObjectId(userId)})
                
            },
        }, 
        {
            $lookup:{
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerInfo",
                pipeline : [
                    {
                        $project :{
                            username : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $addFields :{
                ownerDetails : {
                    $arrayElemAt : ["$ownerDetails",0]
                }
            }
        },
        {
           $sort : sortStage,
        },
        {
            $skip : pageSkip
        },
        {
             $limit : videolimit,
        },
        {
            $project : {
            videoFile : 1,
            thumbnail : 1,
            title : 1,
            "ownerInfo.username" : 1,
            "ownerInfo.avatar" :1,

        }
    }
    ])
  
    console.log(AllVideo)
return res
    .status(200)
    .json(200,{ data : AllVideo ,meta : {
        currentPage : parseInt(page,10),
        limit : videolimit,
        total :AllVideo.length,
    }})

})

const publishVideo = asyncHandler(async(req,res)=>{
    // get what video want to upload
    const {title ,  description, isPublished } = req.body
    // console.log(req.body)
    if([title,description].some((field) => field?.trim()==="")){
        throw new ApiError(400, "title and dicription are required")
    }

    
    const videoLocalPath = req.files?.videoFile?.[0]?.path
    // console.log(videoLocalPath)

    if(!videoLocalPath){
        throw new ApiError(400,"VideoFile is required");
    }

    const videoFile = await uploadOnClodinary(videoLocalPath)
    // console.log(videoFile) 

    if(!videoFile){
        throw new ApiError(400,"Failed to upload video")
    }
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    console.log(thumbnailLocalPath)

    const thumbnail = await uploadOnClodinary(thumbnailLocalPath)
    // console.log(thumbnail)

    if(!thumbnail){
        throw new ApiError(400 , "Failed to uplod thumbnail")
    }


    // if(!isPublished){
    //     throw new ApiError("video is not allowed for publish");
    // }
    
    
    try {
        const video= await Video.create(
            {
            title,
            description,
            videoFile : videoFile?.url,
            thumbnail : thumbnail?.url, 
            owner : req.user,
            isPublished,
        }
    )
    
        const videoPublished = await Video.findById(video._id)
        // console.log(videoPublished)
    
        
    
        if(!videoPublished){
            throw new ApiError(500, "Video is not published")
        }

   
    
        return res.status(202).json(
            new ApiResponse(200,videoPublished,"Video published successFully")
        )
    } catch (error) {
        console.log("Error : ",error)
    }
})


const getVideoById = asyncHandler(async(req,res)=>{
    const {videoId}   = req.params 
    console.log(videoId) 
    console.log(req.params)

    // if(!mongoose.Types.ObjectId.isValid(videoId)){
    //     throw new ApiError(500 , "Invalid ObjectId")
    // }

    if(!videoId){
        throw new ApiError(400, "video id not found")
    }

    const video =   await Video.findById(videoId).populate("owner");

    console.log(video);

    if(!video){
        throw new ApiError(400 , "Failed to get video by Id")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"get video by id successsfully")
)
})

const updatedVideo = asyncHandler(async(req,res)=>{
    const { videoId } = req.params;
    const { title, description } = req.body;
    // console.log(req.files?.thumbnail?.[0])
    // const thumbnailLocalPath =  req.file?.path


    // if(!thumbnailLocalPath){
    //     throw new ApiError(400 , "thumbnailLocalPath is not found")
    // }

    
    if(!videoId){
        throw new ApiError(400, "video id not found")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(400,"video does not exist in dataBase")
    }

    if(!req.user?._id.equals(video.owner)){
        throw new ApiError(500, "only owner can edit the video")
    }

    // if ([title, description].some((field) => !field || field.trim() === "")) {
    //     throw new ApiError(400, "Title and description cannot be empty");
    // }


    console.log(title, description)


    // if(!title || !description){
    //     throw new ApiError(400, "Description or email is required")
    // }

    const updateFields ={}

    if(title?.trim()) {
        updateFields.title = title
    }

    if(description?.trim()) {
        updateFields.description = description
    }

    // if(thumbnailLocalPath){
    //  await deleteforUpdatingVideo(videoId , thumbnailLocalPath)

    //  const thumbnail = await uploadOnClodinary(thumbnailLocalPath)

    //  if(!thumbnail.url){
    //     throw new ApiError(400 , "thumbnai is failed to upload")
    //  }

    //  updateFields.thumbnail = thumbnail.url
    // }

    // if (Object.keys(updateFields).length === 0) {
    //     throw new ApiError(400, "No valid fields provided to update");
    // }

    
    const updatedVideo = await Video.findByIdAndUpdate(videoId, 
        {
            $set :
              updateFields
        },
        {
            new : true
        }
    )

    if(!updatedVideo){
        throw new ApiError(400 , "failed to update video")
    }

    // await video.save({ validateBeforeSave : false})
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video is updated successfully"))
})


const deleteforUpdatingVideo = async (videoId , thumbnailLocalPath)=>{
    if(!videoId){
        throw new ApiError(404 , "video id is required")
    }

    try {
        const video = await Video.findById(videoId)
        
        if(!video){
            throw new ApiError("400" , "video is not in Database")
        }

        if(thumbnailLocalPath){
            if(video.videoFile){
                const videoUrl = await getPublishIdfromCloudinary(video.videoFile)

                if(videoUrl){
                    await deleteFromCloudinary(videoUrl)
                }
            }
            }


    }catch (error) {
        console.log(error)
    }
}


const deleteVideo = asyncHandler(async(req,res)=>{

    const {videoId} = req.params


    if(!videoId) {
        throw new ApiError(400, "Video id is not found" );
    }


    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

   if(!req.user?._id.equals(video.owner)){
       throw new ApiError(400,"only owner can delete the video, you don't have permission")
   }

  const videoFileId = await getPublishIdfromCloudinary(video.videoFile)
  const thumbnaiId = await getPublishIdfromCloudinary(video.thumbnail)

  if(!videoFileId){
    throw new ApiError(400, "failed to fetch videoFile id")
  }

  if(!thumbnaiId){
    throw new ApiError(400, "failed to fetch thumbnail id")
  }

  await deleteFromCloudinary(videoFileId)
  await deleteFromCloudinary(thumbnaiId)


   const deletedVideo = await Video.findByIdAndDelete(videoId)
   console.log(deletedVideo)
   if(!deletedVideo){
    throw new ApiError(400 , "fail to delete video");
   }

   return res
   .status(200)
   .json(200, deletedVideo, "video deleted successfully")

})

export {publishVideo,getAllVideos,getVideoById,updatedVideo,deleteVideo}


 