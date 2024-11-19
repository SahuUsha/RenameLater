import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name : {
        type : String,
        required  : true,
    },
    addressline1 : {
        type : String,
        required : true,
    },
    addressline2 : {
        type : String,
    },
    city : {
        type : String,
        required : true,
    },
    pincode: {
        type : String,
        required : true,
    },
    specialization: [
        {
            type : String,
        }
    ]


},{})

export const Hospital= mongoose.model("Hospital" ,hospitalSchema )