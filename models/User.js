import mongoose from "mongoose";
const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Chat",
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        prompt: String,
        response: String,
        tokensUsed: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    chatSession: [chatSessionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
