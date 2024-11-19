import mongoose from "mongoose";
import { Category } from "./category.model";
const productSchema =  new mongoose.Schema({
  description : {
    required : true,
    type: String,
    
  },
  name : {
    required : true,
    type: String,
    
  },
  productImage : {
    // keep it in in diff folder in local  or use third party service cloudnary to store image and video and in response it return url

    type : String,
  },
  price :{
    type : Number,
    default: 0,
  },
  stock : {
    default : 0,
    type : Number,
  },
  Category:{
  type : mongoose.Schema.Types.ObjectId,
  ref : "Category",
  required : true,
  },
  owner : {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'User'
  },
},{timestamps : ture})


export const Product = mongoose.model('Product' , productSchema )