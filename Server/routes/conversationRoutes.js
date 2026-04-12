import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Branch from "../models/Branch.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      title: title?.trim() || "New Chat",
      lastMessageId: null,
    });
    res.status(201).json(conversation);
  } catch (_err) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await Conversation.deleteOne({ _id: id });
    await Message.deleteMany({ conversationId: id });
    await Branch.deleteMany({ conversationId: id });

    return res.json({
      message: "Conversation deleted successfully",
      deletedConversationId: id,
    });
  } catch (_err) {
    return res.status(500).json({ error: "Failed to delete conversation" });
  }
});

export default router;