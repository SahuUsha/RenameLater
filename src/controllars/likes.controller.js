import mongoose from "mongoose";
import { Like } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const userId = req.user?._id;

    if(!videoId){
        throw new ApiError(400,"videoId is required")
    }

    const existingLike = await Like.findOne({
        video : videoId,
        likedBy : userId
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike?._id)
    }
    else{
        const newLike = await Like.create({
            video : videoId,
            likedBy : userId
        })

        if(!newLike){
            throw new ApiError(400, "faild to like video")
        }
    }

    const totalLikes = await Like.countDocuments({video:videoId});

    return res.status(200).json(
        new ApiResponse(200, {liked : !existingLike , totalLikes}, "Like toggled successfully")
    )

})

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {userId} = req.user?._id

    console.log(commentId)

    if(!commentId){
        throw new ApiError(400,"CommentId is required")
    }

    const existingLike = await Like.findOne({
        comment : commentId,
        likedBy : userId
    });
 
    if(existingLike){
        await Like.findByIdAndDelete(existingLike?._id)
    }

    else{
        const newLike = await Like.create(
            {
            comment :commentId,
            likedBy : userId,
          },
    )

        if(!newLike){
            throw new ApiError(400, "faild to like video")
        }
    }

    const totalLikes = await Like.countDocuments({comment:commentId});

    return res.status(200).json(
        new ApiResponse(200, {liked : !existingLike , totalLikes}, "Like toggled successfully")
    )
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} =  req.params
    const userId = req.user?._id

    if(!tweetId){
        throw new ApiError(400, "tweet id is required");
    }
   
    const existingLike = await Like.findOne({
        tweet : tweetId,
        likedBy : userId
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike?._id)
    }
    else{
        const newLike = await Like.create({
            tweet : tweetId,
            likedBy : userId
        })

        if(!newLike){
            throw new ApiError(400, "faild to like video")
        }
    } 

    const totalLikes = await Like.countDocuments({tweet:tweetId});

    return res.status(200).json(
        new ApiResponse(200, {liked : !existingLike , totalLikes}, "Like toggled successfully")
    )


})

const getLikesVideos = asyncHandler(async(req,res)=>{
    const {page = 1, limit= 10} = req.query
    const parsedLimit = parseInt(limit);
    const pageSkip = (page-1)*parsedLimit;
    // const allLikeVideo = await Like.find({
    //     likedBy : req.user._id
    // }).skip(pageSkip).limit(parsedLimit)

   

    const allLikeVideo = await Like.aggregate([
        {
            $match:{
                likedBy : new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from : "videos",
                localField: "video",
                foreignField: "_id",
                as: "LikeVideos",
            //     pipeline :[
            //         {
            //             $project: {
            //                 videoFile : 1,
            //                 thumbnail : 1,
            //                 title : 1,
            //                 description : 1,
            //             }
            //         }
            //     ]
            }
        },
        {
            $skip : pageSkip
        },
        {
            $limit: parsedLimit
        }
    ])
     
    console.log(allLikeVideo)
 
    if(!allLikeVideo) {
        throw new ApiError(504, "Couldn't find likes video")
    }

   return res
   .status(200)
   .json(new ApiResponse(200, allLikeVideo,"successfully found video"))


})
export {toggleVideoLike,toggleCommentLike,toggleTweetLike, getLikesVideos}