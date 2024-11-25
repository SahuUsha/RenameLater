import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


const connectDB = async()=>{
    try {
        
      const connectInstanceDB = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      console.log(`\n Mongodb connected !! DB HOST : ${connectInstanceDB.connection.host}`);
    } catch (error) {
        console.log("MongoDB is not connected ",error);
        process.exit(1)
    }
}

export default connectDB