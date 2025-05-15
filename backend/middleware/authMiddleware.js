const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Event = require("../models/eventModel");

const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("TOKEN:", token);
    console.log("DECODE:", decoded);

    const user = await User.findById(decoded.id);
    console.log("USER:", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token or user not found." });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

const checkClubOwnership = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next();
    }

    let clubIdFromRequest = req.body.clubId || req.params.clubId;

    if (!clubIdFromRequest && (req.body.eventId || req.params.eventId)) {
      const event = await Event.findById(
        req.body.eventId || req.params.eventId
      );
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
      clubIdFromRequest = event.club.toString();
    }

    if (!clubIdFromRequest) {
      return res
        .status(400)
        .json({ message: "Club ID or related resource ID is required." });
    }

    if (
      req.user.role === "spoc" &&
      clubIdFromRequest !== req.user.club.toString()
    ) {
      return res
        .status(403)
        .json({
          message: "Access denied. You are not authorized for this club.",
        });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error checking club ownership.",
        error: error.message,
      });
  }
};

module.exports = { protect, restrictTo, checkClubOwnership };
