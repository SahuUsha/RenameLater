
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";
import {Video}  from "../models/video.model.js";
import ApiResponse from "../utils/ApiResponse.js";


const getAllVideos = asyncHandler(async(req,res)=>{
    const {page = 1 , iimit = 10 , query , sortBy , sortType ,userId} = req.query
    conole.log(req.query)

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


    const video =   await Video.findById(videoId);

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



export {publishVideo,getAllVideos,getVideoById}
