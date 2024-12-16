import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getChannelStats = asyncHandler(async(req,res)=>{
     

  const getChannelStats = await User.aggregate([
      {
         $match :{
            _id : new mongoose.Types.ObjectId(req.user._id)
         }
      },
      {
        $lookup :{
            from : "subscriptions",
            localField: "_id",
            foreignField : "channel",
            as : "subscribers"

        }

      },
      {
        $lookup : {
            from :"videos",
            localField : "_id",
            foreignField : "owner",
            as: "videos",
            pipeline :[
                {
                    $lookup:{
                        from : "likes",
                        localField : "_id",
                        foreignField : "likeBy",
                        as : "likes",
                        pipeline:[
                            {
                                $addFields : {
                                    Videolikes :{
                                        $size : "$likes"
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
      },
      {
        $addFields :{
            totalViews : {
                $sum : "$videos.views"
            },
            totalLikes :{
                $sum : "$videos.Videolikes"
            },
            totalVideos:{
                $sum : "$videos"
            },
            $totalSubscriber : {
                $sum :" $subscribers"
            }

        }
      }
  ])

  if(getChannelStats){
    throw new ApiError(400 , "channek status is not found")
  }

  return res.status(200).json(new ApiResponse(200, getChannelStats,"successfully get channel status"))

})

const getChannelVideos = asyncHandler(async (req,res)=>{
      
    // const {userId} = req.user._id
       
    const allVideo = await Video.find({owner: req.user?._id})

    if(!allVideo){
        throw new ApiError(400, "Video is not found");
    }

    console.log(allVideo)
    return res.status(200).json(new ApiResponse(200,allVideo,"Successfully fetched video"))
 

})
export {
    getChannelStats,
    getChannelVideos
}