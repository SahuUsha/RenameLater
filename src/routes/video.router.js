import {Router} from 'express';
import  verifyJWT from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"


import {publishVideo, 
    getAllVideos,
    getVideoById,
    updatedVideo,
    deleteVideo,
    incrementVideoView
} from "../controllars/video.controller.js"
const router = Router();
router.use(verifyJWT) ; // apply for all routes

router.route("/").get(getAllVideos).post(
    // [
    //     body('title').
    // ],
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

router.route("/:videoId").get(getVideoById).patch(updatedVideo).delete(deleteVideo)
router.route("/view/:videoId").post(incrementVideoView)

export default router
