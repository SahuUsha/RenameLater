// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path : './env'
})

connectDB()
.then(()=>{
    
   // listen for err
app.on("error" , (error)=>{
   console.log("Error : " ,error)
   throw error
})

   // if there is not any port by default listen on 8000
   app.listen(process.env.PORT || 8000,()=>{
      console.log(`${`server is running at port : ${process.env.PORT }`}`)
   }) 
})
.catch((err)=>{
   console.log("MONGO db connection error :",err);
})






















/*
import mongoose from "mongoose";
import express from "express";
import {DB_NAME} from "../constants.js";

const app = express();

(async () =>{
 try {
   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//    listen express
   app.on("error" , (error)=>{
         console.log("mongodb is not responsing error : ",error)
         throw error
   })

   app.listen(process.env.PORT,()=>{
    console.log(`App is listening on port ${process.env.PORT}`);
   })

 } catch (error) {
    console.log("ERROR : " , error)
    
 }

})()
 */