import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { createPlaylist, getPlaylistById, getUserPlaylists } from "../controllars/playlist.controller.js";



const router= Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist)
router.route("/user/:userId").get(getUserPlaylists);

router.route("/:playlistId").get(getPlaylistById)

export default router