import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema(
    {
     name : {
        types: String,
        required : true,
        unique: true
     },
     descirption : {
        types : String,
        required : true,
     },
     videos:[{
        types: mongoose.Types.ObjectId,
        ref: "Video"
     }],
     owner : {
        types : mongoose.Types.ObjectId,
        ref : "User",
        required : true,
     }

    },
    {timestamps:true})

export const Playlists = mongoose.model("Playlists " ,playlistSchema ) 