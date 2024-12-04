import {Router} from "express"
import {registerUser} from "../controllars/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser } from "../controllars/user.controller.js";
import {logoutUser,
    refreshaccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    getUserChannelProfile,
    updateUserAvatar,
    getWatchHistory,
    updateUserCoverImage,
    
}  from "../controllars/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";


const router = Router()

//from here we will send user
// here we wring routes in / register
router.route("/register").post(
    // it will accept multiple file--> middleware
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount: 1
        }
    ]), 
    registerUser
) 
 // go to register method in controller -->call method registerUser
// router route("/login").post(login)

// url will create in this way
// http://localhost:8000/users/register
// http://localhost:8000/users/login


router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshaccessToken)
router.route("/change-password").patch(verifyJWT,changeCurrentPassword)
router.route("/currentUser").get(verifyJWT,getCurrentUser)
router.route("/updateAccountDetail").patch(verifyJWT,updateAccountDetail)
router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("")
router.route("/c/:username").get(verifyJWT,getUserChannelProfile) // here we taking data from param
router.route("/watchHistory").get(verifyJWT,getWatchHistory)



export default router; 