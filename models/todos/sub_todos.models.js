import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema(
    {
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
        ref : "SubTodo"
    }
]



} ,{timestamps : true})
//  timestamp given -- createdAt , updatedat

export const SubTodo = mongoose.model("SubTodo" , subTodoSchema);

// kya model banau aour kiske base ,me banau
// in database it store in plural form me and in lowercase