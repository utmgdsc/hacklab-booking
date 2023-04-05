const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { Request } = require("./requests");

const AccountSchema = new Schema({
  utorid: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["student", "prof", "admin"],
    default: "student",
  },
  accessGranted: { type: Boolean, required: true, default: false },
  activeRequests: {
    type: Array,
    ref: "Request",
    default: [],
  },
  pendingRequests: {
    type: Array,
    ref: "Request",
    default: [],
  },
  theme: {
    type: String,
    required: true,
    enum: ["light", "dark", "system"],
    default: "system",
  },
  language: {
    type: String,
    required: true,
    enum: ["en"],
    default: "en",
  },
});

module.exports = {
  Account: mongoose.model("Account", AccountSchema),
};
