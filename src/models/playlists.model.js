import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema(
    {
     name : {
        type: String,
        required : true,
        unique: true
     },
     description : {
        type : String,
        required : true,
     },
     videos:[{
        type: mongoose.Types.ObjectId,
        ref: "Video"
     }],
     owner : {
        type: mongoose.Types.ObjectId,
        ref : "User",
        required: true
   
     }

    },
    {timestamps:true})

export const Playlists = mongoose.model("Playlists " ,playlistSchema ) 