// models/clubModel.js
const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    abbreviation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    spoc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
