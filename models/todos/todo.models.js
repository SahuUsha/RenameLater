import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({
    content: {
        type : String,
        required : true,
    },
    complete : {
        type : Boolean,
        default: false,
    },
    createdBy:{
        // give reference
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"  // model name
    },
    subTodos :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "SubTodo",
        }
    ] // array of sub todos
},{timestamps : true})


export const Todo = mongoose.model(Todo , todoSchema)