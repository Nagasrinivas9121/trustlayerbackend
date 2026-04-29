const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  scanOptions: {
    type: [String],
    default: [],
  },
  score: {
    type: Number,
  },
  issues: {
    high: Number,
    medium: Number,
    low: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);
