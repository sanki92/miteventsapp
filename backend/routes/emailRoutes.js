const express = require("express");
const router = express.Router();
const { sendEventReminderEmails } = require("../controllers/emailController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/send-reminders", protect, restrictTo("admin", "spoc"), sendEventReminderEmails);

module.exports = router;
