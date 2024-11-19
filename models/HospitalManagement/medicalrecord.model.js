import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({},{})

export const medicalRecord = mongoose.model("MedicalRecord" ,medicalRecordSchema )