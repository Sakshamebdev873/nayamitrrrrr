import mongoose from "mongoose";
const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Chat',
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
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
    name: {
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
    chatSession : [chatSessionSchema]
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
