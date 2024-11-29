// it will verfiy user is present or not

import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
// Authorization : Bearer <token>
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token) {
        throw new ApiError(401 , "Unauthorized Request")
    }
    
    
       const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
      const user =  await User.findById(decodedToken?._id).select("-password -refreshTocken")
      if(!user){
    
    
        throw new ApiError(401, "invalid access token")
      }
    
      req.user=user;
      next()
} catch (error) {
    throw new ApiError(401,"error?.message" || "Invalid access token" )
}
}) 