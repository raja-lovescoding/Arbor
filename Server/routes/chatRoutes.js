import express from "express";
import { createMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.get("/", getMessages);
router.post("/", createMessage);

export default router;