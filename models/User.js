const mongoose = require("mongoose");

// Define Schemes
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  regdate: { type: Date, default: Date.now, required: true },
  maintag: { type: String, required: true },
  register: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nickname: String,
  posts: postSchema
});

module.exports = mongoose.model("User", userSchema, "user");
