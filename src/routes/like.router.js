import { Router } from "express";

import verifyJWT from "../middleware/auth.middleware.js";
import { getLikesVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllars/likes.controller.js";


const router = Router();

router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike)
router.route("/toggle/t/:tweetId").post(toggleTweetLike)
router.route("/videos").get(getLikesVideos)



export default router