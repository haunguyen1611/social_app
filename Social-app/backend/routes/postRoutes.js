import express from "express";
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyPost,
  getFeedPost,
} from "../controller/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/:id", getPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyPost);
export default router;
