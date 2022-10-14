import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MemorySchema = new Schema({
  file: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const Memory = mongoose.model("Memory", MemorySchema);

export default Memory;
