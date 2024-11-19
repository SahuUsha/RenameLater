import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name : {
         type : String,
         required : true,

    }, 
    diagonsewith : {
        type : String,
        required : true,
        
    },
   
    address : {
        type : String,
        required : true,
    },
    bloodGroup : {
        type : String,
        required : true,
    },
    Gender: {
        type : String,
        required : true,
        enum  : ["M" , "F" ,"O" ],
        
    },
    age : {
        type : Number,
        required : true,
        
    },
   admittedIn:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hospital",
    }
},{})

export const Patient =  mongoose.model("Patient" ,patientSchema )