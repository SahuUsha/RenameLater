import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";


const getVideoComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {page = 1 , limit =10} = req.query

    console.log(videoId)

    if(!videoId ){
        throw new ApiError(400, "videoId is required")
    }

    const commentlimit = parseInt(limit);
    const pageSkip = (page-1)*commentlimit

    const matchComment = await Comment.find({video: videoId})

    if(!matchComment){
        throw new ApiError(400,"comment not found")
    }

    console.log(matchComment?.owner)
    console.log(matchComment?.video)
    console.log(matchComment)

    

    try {
        const allComment = await Comment.aggregate([
            {
                $match :{
                    video: new mongoose.Types.ObjectId(videoId),
                }
            },
            {
                $lookup :{
                    from : "users",
                    localField : "owner",
                    foreignField : "_id",
                    as : "owner",
                    pipeline : [
                        {
                            $project : {
                               username : 1,
                               avatar : 1
                            }
                        }
                    ]
                }
            },
            // {
            //     $addFields : {
            //         commentCount: { $strLenCP: "$content" },
            //         timeSincePosted: { $subtract: [new Date(), "$createdAt"] },
            //     }
            // },
            {
                $skip : pageSkip
            },
            {
                $limit : commentlimit,
            }
        ])
    
        console.log(allComment)
        if(allComment.length==0){
            throw new ApiError(400 , "Failed to fetch comments")
        }
        // if (!allComment) throw new ApiError(504, "not created");

        return res.status(200).json(new ApiResponse(200 , allComment , "Successfully Fetched the comments"))
    } catch (error) {
        console.log(error)
    }
})




const addComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {content} = req.body

    console.log(videoId)
    console.log(content)
       

    if(!videoId || !content){
        throw new ApiError(404 , "videoId and content are required");
    }
    const comment = await Comment.create({
        content ,
        video : videoId,
        owner : req.user,
    })
    console.log(comment)

    if(!comment){
        throw new ApiError(400 , "comment is not created");
    }

return res.status(200).json(new ApiResponse(200 , comment , "Comment added successfully"))

})


const updateComment = asyncHandler(async(req,res)=>{
    const{commentId} = req.params
    const {content} = req.body

    if(!commentId){
        throw new ApiError(400 , "CommentId is required")
    }
    
    if(!content){
        throw new ApiError(400 , "comment is not found")
    }
   
    
    const comment = await Comment.findById(commentId)
    
     
    if(!comment){
        throw new ApiError(400 , "comment is not found in DB")
    }
    console.log(comment.owner)
    console.log(req.user?._id)

    if(comment.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400 , "You are not allowed to update comment")
    }



    comment.content = content

    try {
        comment.save()
    } catch (error) {
        console.log(error)
    }

    return res.status(200).json(new ApiResponse(200, comment , "Comment is updated"))

})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(400 , "CommentID is required")
    }
     

   const comment =  await Comment.findById(commentId)

   if(!comment){
    throw new ApiError(400 , " comment is not found")
   }

   if(comment.owner.toString() !== req.user?._id.toString()){
    throw new ApiError(400 , "You are not allowed to update comment")
}


   const deltedComment = await Comment.findByIdAndDelete(commentId);

   if(!deltedComment){
    throw new ApiError(400 , "Comment is not deleted")
   }

   return res.status(200).json(new ApiResponse(200 , "Comment is deleted"))

})



export {addComment,updateComment,deleteComment,getVideoComment}