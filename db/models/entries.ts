import mongoose from "mongoose";

const { Schema } = mongoose;

const entrySchema = new Schema({
  url: { type: String, required: true },
  name: { type: String, required: false },
  description: { type: String, required: false },
  careTipps: { type: String, required: false },
  location: { type: String, required: false },
});

const Entry = mongoose.models.Entry || mongoose.model("Entry", entrySchema);

export default Entry;

