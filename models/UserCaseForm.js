import mongoose from "mongoose";

const UserCaseFormSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Basic Case Info
    caseType: String,
    caseStage: {
      type: String,
      enum: [
        "new_case",
        "pre_filing",
        "filed",
        "discovery",
        "trial_scheduled",
        "judgment_issued",
        "appeal_started",
        "appeal_pending",
        "appeal_decided",
      ],
    },
    jurisdiction: String,
    userRole: { type: String, enum: ["self_represented", "lawyer_assisted"] },

    // User's description / facts
    caseFacts: String,

    // AI-generated or curated outputs
    procedure: String, // Summary of procedure roadmap (Step 2)
    assistingDocuments: String, // Text summary from winning cases (Step 3)
    nextMoves: String, // Tactical next step for the user (Step 4)
  },
  { timestamps: true }
);

export default mongoose.model("UserCaseForm", UserCaseFormSchema);
