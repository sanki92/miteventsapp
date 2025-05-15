const express = require("express");
const {
  registerStudent,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerStudent);

router.get("/verify-email", verifyEmail);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
