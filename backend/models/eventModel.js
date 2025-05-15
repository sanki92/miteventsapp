// models/eventModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    poster: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    singleDayEvent: {
      type: Boolean,
      required: true,
    },
    seatsLimit: {
      type: Number,
      required: true,
      min: 1,
    },

    // registeredStudents: [
    //   {
    //     student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     registeredAt: { type: Date, default: Date.now },
    //     qrCode: { type: String, required: true },
    //     hasAttended: { type: Boolean, default: false },
    //     qrReissueCount: { type: Number, default: 0 },
    //   },
    // ],

    registeredStudents: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        registeredAt: { type: Date, default: Date.now },
        qrCodes: [
          {
            date: { type: Date, required: true },
            qrCode: { type: String, required: true },
            expired: { type: Boolean, default: false },
            hasAttended: { type: Boolean, default: false },
          },
        ],
        qrReissueCount: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// Virtual to count filled seats
eventSchema.virtual("filledSeats").get(function () {
  return this.registeredStudents.length;
});

module.exports = mongoose.model("Event", eventSchema);
