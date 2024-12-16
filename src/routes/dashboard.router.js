import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllars/dashboard.controller.js";

 const router = Router()

 router.use(verifyJWT)

 router.route("/videos").get(getChannelVideos)
 router.route("/stats").get(getChannelStats)



 export default router