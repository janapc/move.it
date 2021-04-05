import mongoose from "mongoose";

const RankSchema = new mongoose.Schema({
  username: { type: String, required: true },
  level: { type: Number, required: false, default: 1 },
  experience: { type: Number, required: false, default: 0 },
  avatar: { type: String, required: false },
  challenges: { type: Number, required: false, default: 0 },
  token: { type: String, required: true }
});

export default mongoose.models && mongoose.models.Rank
  ? mongoose.models.Rank
  : mongoose.model("Rank", RankSchema, "Rank");
