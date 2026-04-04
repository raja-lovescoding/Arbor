import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    parentBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);