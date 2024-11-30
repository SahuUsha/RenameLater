// it will verfiy user is present or not

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


 const verifyJWT = asyncHandler(async(req,_,next)=>{
// Authorization : Bearer <token>
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token) {
        throw new ApiError(401 , "Unauthorized Request")
    }
    
    
       const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       console.log(decodedToken);
    
      const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")
      if(!user){
        throw new ApiError(401, "invalid access token")
      }
    
      req.user=user;
      next() // yo go for next middleware or  work
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token" )
}
}) 

export default verifyJWT