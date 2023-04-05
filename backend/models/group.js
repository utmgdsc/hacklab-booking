const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { Request } = require("./requests");

const GroupSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  members: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  requests: [{ type: Array, ref: "Request", default: [] }],
  managers: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  // faculty: [
  //   {type: Schema.Types.ObjectId, ref: 'Account'}
  // ]
});

module.exports = {
  Group: mongoose.model("Group", GroupSchema),
};
