import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnClodinary} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js"




const registerUser = asyncHandler(async(req,res)=>{
    // get user details from fronted
    // validation ->not empty , other
    // check if user already exists: by username,email
    // check for images , check for avatar
    // upload them to cloudinary--> check for avatar
    // create user object-- create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response


    // we will get response  from body or url or json or uri
    const {fullName , email , username,password} = req.body
    console.log("email: ",email)
    console.log("password: ",password)

    // check from postmax
    
    // validation
    // if(fullName ===""){
    //     throw new ApiError(400,"fullName is required")
    // }

    if(
        [fullName,email,username,password].some((field)=> field.trim()==="")

    ){
        throw new ApiError(400, "All field are required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new ApiError(400, "Invalid email format");
    }

// check user already  exist or not
  const existedUser =  User.findOne({

    $or : [{username},{email}]
   })
   console.log(existedUser);
   if(existedUser){
    throw new ApiError(409 ,"User with email or username already exist")
   }


  const avatarLocalPath =  req.files?.avatar[0]?.path
   //we will take file from multer her it add many thing to body
   console.log(req.files)
   console.log(req.files.avatar)
   console.log(avatarLocalPath);

   const coverImageLocalPath = req.files?.coverImage[0]?.path
   console.log(coverImageLocalPath)

   if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
   }

 const avatar= await uploadOnClodinary(avatarLocalPath)
 console.log(avatar)
 const coverImage= await uploadOnClodinary(coverImageLocalPath)

 if(!avatar){
    throw new ApiError(400,"avatar file is required")
 }

const user= await User.create({
    fullName ,
    avatar: avatar.url,
    coverImage: coverImage?.url|| "",
    email,
    password,
    username : username.lowercase()

 })

 // check User create successfull
const createdUser =  User.findById(user._id).select(
    "-password -refreshTocken " // here we write what do attribut we don't want
)

if(!createdUser){
    throw new ApiError(500,"some thing went worng while registering the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
)
console.log(createdUser);

})



export default registerUser;
