import express from "express"
import protectRoute from "../middlewares/protectRoute.js";
import { sendMessage, getMessage, getConversations } from "../controller/messageController.js";
const router = express.Router()

router.get("/conversations", protectRoute , getConversations);
router.get("/:otherUserId", protectRoute , getMessage);
router.post("/", protectRoute , sendMessage);

export default router;