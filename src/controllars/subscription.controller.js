

import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubcription = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
    const userId = req.user._id
   
    if(!channelId){
        throw new ApiError(400 , "channel id is required");
    }

    const isSubscribe = await Subscription.findOne({
        subscriber : userId,
        channel : channelId

    })

    if(isSubscribe){
        await Subscription.findByIdAndDelete(isSubscribe?._id)
    }else{
        const newSubscribe = await Subscription.create({
            subscriber : userId,
            channel : channelId
        })

        console.log(newSubscribe)

        if(!newSubscribe){
            throw new ApiError(400 , "Failed to subscribe channel")
        }
    
    }
    
    const totalSubscriberInDoc = await Subscription.countDocuments({channel : channelId});
    console.log(totalSubscriberInDoc)
    
    return res.status(200).json(
      new ApiResponse(200, {subscribe : !isSubscribe,totalSubscriberInDoc},"subscribe toggled success")
    
    )
})

const getUserChannelSubscriber = asyncHandler(async(req,res)=>{
      const {channelId} = req.params

      if(!channelId){
        throw new ApiError(400, "user channel id is required")
      }

      const userSubscriber = await Subscription.find({channel:channelId })

      console.log(userSubscriber)

      if(!userSubscriber){
        throw new ApiError(400, "no subscriber")
      }
       
      const subscriber = await Subscription.countDocuments({channel : channelId})

return res.status(200).json(
    new ApiResponse(200, {userSubscriber,subscriber}, "Successfully fetched user channel")
)

})

const getSubscribedChannels = asyncHandler(async(req,res)=>{
     const {subscriberId} = req.params

     if(!subscriberId){
        throw new ApiError(400,"subscriber id is required")
     }

     const subscribedChannels = await Subscription.find({subscriber:subscriberId})

      console.log(subscribedChannels)

     if(!subscribedChannels){
        throw new ApiError(400,"failed to fetch subscribed channel")
     }

     const subscribed = await Subscription.countDocuments({subscriber:subscriberId})

     return res.status(200).json(
        new ApiResponse(200, {subscribedChannels,subscribed}, "Successfully fetched user channel")
    )
})
    
export {toggleSubcription,getUserChannelSubscriber,getSubscribedChannels}