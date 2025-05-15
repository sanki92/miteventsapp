const express = require("express");
const router = express.Router();
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
  checkRegistrationStatus,
  markAttendance,
  getAttendanceReport,
  reissueQrCode
} = require("../controllers/eventController");
const {
  protect,
  restrictTo,
  checkClubOwnership,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  protect,
  restrictTo("admin", "spoc"),
  checkClubOwnership,
  createEvent
);

router.put("/update", protect, restrictTo("admin", "spoc"), updateEvent);

router.delete("/delete/:id", protect, restrictTo("admin", "spoc"), deleteEvent);

router.get("/", protect, getAllEvents);

router.get("/:id", protect, getEventById);

router.post(
  "/register/:eventId",
  protect,
  restrictTo("student"),
  registerForEvent
);

router.delete(
  "/register/:eventId",
  protect,
  restrictTo("student"),
  cancelRegistration
);

router.get(
  "/registrations/:eventId",
  protect,
  restrictTo("admin", "spoc"),
  checkClubOwnership,
  getEventRegistrations
);

router.get(
  "/register/status/:eventId",
  protect,
  restrictTo("student"),
  checkRegistrationStatus
);

router.post("/scan", protect, restrictTo("spoc"), checkClubOwnership, markAttendance);

router.get(
  "/attendance/:eventId",
  protect,
  restrictTo("admin", "spoc"),
  checkClubOwnership,
  getAttendanceReport
);

router.post("/reissue/:eventId", protect, restrictTo("student"), reissueQrCode);


module.exports = router;
