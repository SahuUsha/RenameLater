import {Router} from 'express';
import  verifyJWT from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"


import {publishVideo, 
    getAllVideos,
    getVideoById
} from "../controllars/video.controller.js"
const router = Router();
router.use(verifyJWT) ; // apply for all routes

router.route("/").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount : 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    publishVideo
);

router.route("/:videoId").get(getVideoById)






export default router
