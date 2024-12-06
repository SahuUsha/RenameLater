import mongoose , {Schema}from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        owner :{
           types : mongoose.Types.ObjectId,
           ref :  "User"

        },
        content : 
        {
            types : String,
            required : true,
        },
        video : {
            type : mongoose.Types.ObjectId,
            ref : "Video ",
            
        }

},
{timestamps: true})
commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment" ,commentSchema )