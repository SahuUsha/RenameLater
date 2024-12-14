import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllars/comments.controller.js";



const router = Router()

router.use(verifyJWT)

router.route("/:videoId").post(addComment)


router.route("/c/:commentId").patch(updateComment).delete(deleteComment)

router.route("/user/:videoId").get(getVideoComment)

export default router