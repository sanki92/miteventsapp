const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Event = require("../models/eventModel");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const scheduleEmailJobs = () => {
  // 0 0 * * *
  cron.schedule(" */30 * * * * *", async () => {
    try {
      console.log("Running QR expiration and sending job...");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      console.log("Tomorrow: ", tomorrow);

      const res = await Event.updateMany(
        { "registeredStudents.qrCodes.date": { $lte: tomorrow } },
        {
          $set: {
            "registeredStudents.$[].qrCodes.$[elem].expired": true,
          },
        },
        {
          arrayFilters: [{ "elem.date": { $lte: tomorrow } }],
        }
      );
      console.log("RESPONSE: ", res);
      const events = await Event.find({
        "registeredStudents.qrCodes.date": {
          $gte: tomorrow,
          $lt: dayAfterTomorrow,
        },
        "registeredStudents.qrCodes.expired": false,
      }).populate("registeredStudents.student");
      console.log("EVENTS: ", events);

      for (let event of events) {
        for (let student of event.registeredStudents) {
          let qrCodes = student.qrCodes;

          console.log("Previous day QR checked and Expired");

          const nextQR = qrCodes[0];

          console.log("Next day QR is selected");

          if (nextQR) {
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: student.student.email,
              subject: `QR Code for ${
                event.title
              } - ${tomorrow.toDateString()}`,
              html: `Here is your QR for tomorrow. Use it for attendance.`,
              attachments: [
                {
                  filename: "event-qr.png",
                  content: nextQR.qrCode.split(",")[1],
                  encoding: "base64",
                },
              ],
            };
            await transporter.sendMail(mailOptions);
            console.log("Email sent with Next day QR");
          }
        }
        await event.save();
      }
    } catch (error) {
      console.error("error", error);
    }
  });
};

module.exports = scheduleEmailJobs;












