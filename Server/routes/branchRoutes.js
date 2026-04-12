import express from "express";
import Branch from "../models/Branch.js";
import { getBranchTitle } from "../utils/titleUtils.js";

const router = express.Router();

// create new branch
router.post("/", async (req, res) => {
  try {
    const { parentBranchId, lastMessageId, conversationId, title } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required" });
    }

    const branch = await Branch.create({
      conversationId,
      parentBranchId: parentBranchId || null,
      title: title?.trim() || getBranchTitle(""),
      lastMessageId,
    });

    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: "Failed to create branch" });
  }
});

// get all branches
router.get("/", async (req, res) => {
  const { conversationId } = req.query;

  if (!conversationId) {
    return res.status(400).json({ error: "conversationId is required" });
  }

  const branches = await Branch.find({ conversationId }).sort({ createdAt: 1 });
  res.json(branches);
});

// delete branch and all descendants (soft delete - branch records only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required" });
    }

    // verify branch exists and belongs to this conversation
    const branch = await Branch.findOne({ _id: id, conversationId });
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    // find all descendants recursively
    const toDelete = [id];
    let queue = [id];

    while (queue.length > 0) {
      const currentId = queue.shift();
      const children = await Branch.find({ parentBranchId: currentId });
      children.forEach((child) => {
        toDelete.push(child._id);
        queue.push(child._id);
      });
    }

    // delete all branches in the tree
    await Branch.deleteMany({ _id: { $in: toDelete } });

    res.json({
      message: "Branch(es) deleted successfully",
      deletedIds: toDelete,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete branch" });
  }
});

export default router;