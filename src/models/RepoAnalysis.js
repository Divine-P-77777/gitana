import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk userId
      required: true,
      index: true,
    },

    repo: {
      owner: String,
      name: String,
      url: String,
    },

    signals: {
      type: Object,
      required: true,
    },

    ai: {
      understanding: Object,
      score: String,
      summary: String,
      roadmap: String,
    },

    scoreValue: {
      type: Number, // extracted from "Score: XX / 100"
    },
  },
  { timestamps: true }
);

export default mongoose.models.Analysis ||
  mongoose.model("Analysis", AnalysisSchema);
