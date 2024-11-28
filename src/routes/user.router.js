import {Router} from "express"
import registerUser from "../controllars/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

//from here we will send user
// here we wring routes in / register
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount: 1
        }
    ]), // it will accept multiple file
    registerUser
) 
 // go to register method in controller -->call method registerUser
// router route("/login").post(login)

// url will create in this way
// http://localhost:8000/users/register
// http://localhost:8000/users/login


export default router; 