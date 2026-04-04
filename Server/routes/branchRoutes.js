import express from "express";
import Branch from "../models/Branch.js";

const router = express.Router();

// create new branch
router.post("/", async (req, res) => {
  try {
    const { parentBranchId, lastMessageId } = req.body;

    const branch = await Branch.create({
      parentBranchId: parentBranchId || null,
      lastMessageId,
    });

    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: "Failed to create branch" });
  }
});

// get all branches
router.get("/", async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

export default router;