import mongoose ,{Schema} from "mongoose";

const tweetSchema = new Schema(
    {
       owner  : {
        types : mongoose.Types.ObjectId,
        ref : "User"
       },
     
    },
    {
timestamps : true

})

export const Tweet = mongoose.model("Tweet",tweetSchema )