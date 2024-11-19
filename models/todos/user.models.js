import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
//         userName : String,
//         email : String,
//         isActive : Boolean,

// we will create object
username: {
    type : String,
    required : true,
    unique : true,
    lowercase : true
},
email : {
    type : String,
    required : true,
    unique : true,
    lowercase : true
},
password : {
    type : String,
    required: [true , "password is required"],
    min: [6, 'must be at least 6'],
    max : [10]
}

} ,{timestamps : true})
//  timestamp given -- createdAt , updatedat

export const User = mongoose.model("User" , userSchema);

// kya model banau aour kiske base ,me banau
// in database it store in plural form me and in lowercase

