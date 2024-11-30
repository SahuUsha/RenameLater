import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnClodinary} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js"



const generateAccessandRefreshTokens=async (userId)=>{
         try{
         const user = await User.findById(userId)
        const accesstoken= user.generateAccessTokenn()
         const refreshtoken = user.generateRefreshTokenn()

         user.refreshToken = refreshtoken
        await user.save({validateBeforeSave : false}); // don't apply any validation like password is required and so on

        return {refreshtoken ,accesstoken}
         }catch(err){
            throw new ApiError(500,"Some thing went wrong while generating access and refresh token")
         }
}


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
    const {fullname , email , username,password} = req.body // taking from frontend
    // console.log("email: ",email)
    // console.log("password: ",password)
    console.log(req.body)

    // check from postmax
    
    // validation
    // if(fullName ===""){
    //     throw new ApiError(400,"fullName is required")
    // }

    if(
        [fullname,email,username,password].some((field)=> field?.trim()==="")

    ){
        throw new ApiError(400, "All field are required")
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if(!emailRegex.test(email)){
    //     throw new ApiError(400, "Invalid email format");
    // }

// check user already  exist or not
  const existedUser =await  User.findOne({

    $or : [{username},{email}]
   })
//    console.log(existedUser);
   if(existedUser){
    throw new ApiError(409 ,"User with email or username already exist")
   }


  const avatarLocalPath =  req.files?.avatar?.[0]?.path
   //we will take file from multer her it add many thing to body
//    console.log(req.files)
//    console.log(req.files.avatar)
//    console.log(avatarLocalPath);

   const coverImageLocalPath = req.files?.coverImage?.[0]?.path
//    console.log(coverImageLocalPath)
   
   //    for checking coverimage is present or not
//    if(req.files && req.Array.isArray(req.files.coverImage) && req.files.coverImage>0){
//     const coverImageLocalPath = req.files?.coverImage?.[0]?.path
//    }

//  but i have used other method 
   

   if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
   }

 const avatar= await uploadOnClodinary(avatarLocalPath)
//  console.log(avatar)
 const coverImage= coverImageLocalPath ? await uploadOnClodinary(coverImageLocalPath) : null

 if(!avatar){
    throw new ApiError(400,"Failed to upload avatar file")
 }

const user= await User.create({
    fullname ,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username : username

 })

 // check User create successfull
const createdUser = await User.findById(user._id).select(
    "-password -refreshTocken " // here we write what do attribut we don't want
)

if(!createdUser){
    throw new ApiError(500,"some thing went worng while registering the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
)
// console.log(createdUser);

})


// console.log(registerUser)


//************* Login************************** 
 
const loginUser=asyncHandler(async(req,res)=>{
    // req body-->data
    // username or email--> take from data base
    // find the user
    // password check--> if not password wrong
    // generate refresh token and acces token
    // send refresh token in cookies
    // send response
    
    const {email ,username,password} = req.body 
   console.log(req.body)
   console.log(req.files)

    console.log(email)
    console.log(username)
    console.log(password)

    if(!password){
        throw new ApiError(400 , "password is required")
    }
    // if(!username || !email  ){
    //    throw new ApiError(400 , "username or email is required")
    // }
    if(!username && !email  ){
       throw new ApiError(400 , "username and email is required")
    }
   

    const user = await User.findOne({

       $or : [{email},{username}]  // find on basis of either username or email

    })

    if(!user){
        throw new ApiError(404,"User does not exist");
    }
   
   const isPasswordValid =  await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credential");
   }
  
   // create method for genrate access token and refresh tocken above

   const {refreshToken, accessToken  } = await generateAccessandRefreshTokens(user._id)
    

 // at this point check that we have to update user or query the user from database if query is not expansive

  const loggedInUser =  await User.findById(user._id).select("-password -refreshToken");

  //
  const options = {  // here we are designing option to send  cookies
    httpOnly : true,
    secure : true
    // if we keep both true then we can  modified it by server only we can modified it through frontend
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken  ,options)
  .cookie("refreshToken" , refreshToken,options)
  .json
  (
    new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken, refreshToken  // here we are sending token if user want to save it in local


    },
    "User logged in successfully"
)
)

})

const logoutUser = asyncHandler(async(req,res)=>{
    // we have get access of user through middleware

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken : 1
            }
        },
        {
            new : true // we can set new attribute
        }
    )

    const options={
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken " , options)
    .clearCookie("refreshToken " , options)
    .json(
        new ApiResponse(200,{},"user logged out")
)

   
})

export {
    registerUser,
    loginUser,
    logoutUser
}
