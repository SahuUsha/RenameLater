import mongoose from "mongoose";

const userecomSchema= new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    password :{
        type : String,
        required : true,
    }
},{timestamps: true})

export const Userecom = mongoose.model('Usercom',userecomSchema)