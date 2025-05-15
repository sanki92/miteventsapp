const express = require("express");
const router = express.Router();
const {
  registerClub,
  updateClubInfo,
  changeSpoc,
  getAllClubs,
  getClubById,
} = require("../controllers/clubController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/register", protect, restrictTo("admin"), registerClub);

router.put(
  "/update-info",
  protect,
  restrictTo("admin", "spoc"),
  updateClubInfo
);

router.put("/change-spoc", protect, restrictTo("admin", "spoc"), changeSpoc);

router.get("/", protect, getAllClubs);

router.get("/:id", protect, getClubById);

module.exports = router;
