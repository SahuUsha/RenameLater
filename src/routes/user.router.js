import {Router} from "express"
import {registerUser} from "../controllars/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser } from "../controllars/user.controller.js";
import {logoutUser}  from "../controllars/user.controller.js";
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


export default router; 