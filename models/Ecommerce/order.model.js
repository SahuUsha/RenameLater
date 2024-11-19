import mongoose from "mongoose";
// minimodel 
const orderItemSchema = new mongoose.Schema({
    // keep id of product
    product  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    },
    quantity :{
        type : Number ,
        required : true,
    }
})


const orderSchema = new mongoose.Schema({
    orderPrice : {
         type : Number,
         required : true,
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    orderItems : {
        type : [orderItemSchema]

        // types : [
        //     {
        //         product
        //     }
        // ]  we can use this approach in htis way
    },
    address : { //  we can also made separate schema
        type : String,
        required : true,
    },
   status : {
    type :String,
    // enm --> choices
    enum : ["PENDING" , "CANCELLED","DELIVERED"],
    default : "PENDING",
   }
   
    
},{timestamps : true})

export const Order = mongoose.model('Order' , orderSchema)