import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : ture ,
    },
    salary : {
        type : String,
        required : true,

    },
    qualification : {
        type : String,
        required : true,
    },
    experienceInYear : {
        type : Number,
        required : true,
        default : true,
    },
    workInHospitals : [  // multiple hospital
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Hospital',
        },

    ]
},{})

export const Doctor= mongoose.model("Doctor" ,doctorSchema )