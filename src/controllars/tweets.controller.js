import { Tweet } from "../models/tweets.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";




const createTweet = asyncHandler(async(req,res)=>{
const {content} = req.body


if(!content){
    throw new ApiError(400, "content is required")
}

const tweet = await Tweet.create({
    content,
    owner : req.user
})

if(!tweet){
   throw new ApiError(400,"tweet is not created")
}
return res.status(200).json(new ApiResponse(200, tweet,"tweet is created successfully"))
})

const getUserTweet = asyncHandler(async(req,res)=>{
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400,"userId is required")
    }

    const allTweets = await Tweet.aggregate([
        {
           $match:{
            owner :  new mongoose.Types.ObjectId(userId)
           }
        },
        {
            $lookup:{
                from : "users",
                localField : "owner",
                foreignField: '_id',
                as: 'ownerInfo',
                pipeline :[
                    {
                        $project:{
                             username : 1,
                             avatar: 1,
                        }
                    }
                ]
            }
        }
    ])
     
     if(!allTweets){
        throw new ApiError(400, "Fialed to fetch the tweets")
     }

     return res.status(200)
     .json(new ApiResponse(200, allTweets, "tweets are fetched successfully" ))


})

const updateTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    const {content} = req.body

    if(!tweetId){
        throw new ApiError(400 , "user Id is required")
    }

    if(!content){
        throw new ApiError(400 , "Content is required ")
    }
    
    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(400, "Tweet is not found")
    }

    if(tweet.owner.toString() !== req.user?._id.toString() ){
        throw new ApiError(400,"You are not allowed to update tweet");
    }
     
    tweet.content = content

    try {
        tweet.save();
    } catch (error) {
        console.log(error);
    }

    return res.status(200).json(new ApiResponse(200, tweet, "tweet is updated successfully"))

   
})

const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    
    
    if(!tweetId){
        throw new ApiError(400 , "user Id is required")
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(400, "tweet is not found")
    }

    if(tweet.owner.toString() !== req.user?._id.toString() ){
        throw new ApiError(400,"You are not allowed to update tweet");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if(!deletedTweet){
        throw new ApiError(400,"failed to delete tweet")
    }
     
    return res.status(200).json(new ApiResponse(200, deletedTweet, "successfully deleted tweet"))


})


export {createTweet, getUserTweet,updateTweet, deleteTweet } 