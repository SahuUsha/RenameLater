import mongoose ,{Schema} from "mongoose"

const LikeSchema = new Schema(
    { 
        comment : {
            types :Schema.Types.ObjectId,
            ref : "Comment"
        },
        video :{
            types : Schema.Types.ObjectId,
            ref : "Video"
        },
        likedBy : {
            types :  Schema.Types.ObjectId,
            ref : "User"
        },
        tweet : {
            types :  Schema.Types.ObjectId,
            ref : "Tweet"
        }

},{timestamps : true})

export const Like = mongoose.model("Like" , LikeSchema)