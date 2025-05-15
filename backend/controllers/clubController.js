const Club = require("../models/clubModel");
const User = require("../models/userModel");

const registerClub = async (req, res) => {
  try {
    const { name, abbreviation, description, spocEmail, image } = req.body;

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can register clubs." });
    }

    const spocUser = await User.findOne({ email: spocEmail });
    if (!spocUser) {
      return res.status(404).json({ message: "SPOC user not found." });
    }

    const normalizedClubName = name.trim().toLowerCase();

    const existingClub = await Club.findOne({
      name: { $regex: new RegExp("^" + normalizedClubName + "$", "i") },
    });
    if (existingClub) {
      return res
        .status(400)
        .json({ message: "A club with this name already exists." });
    }

    const club = new Club({
      name,
      abbreviation,
      description,
      spoc: spocUser._id,
      image,
    });

    await club.save();

    spocUser.role = "spoc";
    spocUser.club = club._id;
    await spocUser.save();

    res.status(201).json({ message: "Club registered successfully.", club });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering club.", error: error.message });
  }
};

const updateClubInfo = async (req, res) => {
  const { clubId, name, description, abbreviation, image } = req.body;

  try {
    if (req.user.role !== "spoc" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only SPOCs & Admin can update club information." });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found." });
    }

    if (
      req.user.role !== "admin" &&
      club.spoc.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this club." });
    }

    if (name) club.name = name;
    if (description) club.description = description;
    if (image) club.image = image;
    if (abbreviation) club.abbreviation = abbreviation;

    await club.save();

    res
      .status(200)
      .json({ message: "Club information updated successfully.", club });
  } catch (error) {
    res.status(500).json({
      message: "Error updating club information.",
      error: error.message,
    });
  }
};

const changeSpoc = async (req, res) => {
  try {
    const { clubId, newSpocEmail } = req.body;

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found." });
    }

    if (
      req.user.role !== "admin" &&
      club.spoc.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to change the SPOC." });
    }

    const newSpocUser = await User.findOne({ email: newSpocEmail });
    if (!newSpocUser) {
      return res.status(404).json({ message: "New SPOC user not found." });
    }

    if (newSpocUser.role === "admin") {
      return res
        .status(400)
        .json({ message: "You cannot assign an admin as a SPOC." });
    }

    const currentSpocUser = await User.findById(club.spoc);
    if (newSpocUser._id.equals(currentSpocUser._id)) {
      return res
        .status(400)
        .json({ message: "The new SPOC is already the current SPOC." });
    }

    if (currentSpocUser) {
      currentSpocUser.role = "student";
      currentSpocUser.club = null;
      await currentSpocUser.save();
    }

    newSpocUser.role = "spoc";
    newSpocUser.club = club._id;
    await newSpocUser.save();

    club.spoc = newSpocUser._id;
    await club.save();

    res.status(200).json({ message: "SPOC changed successfully.", club });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing SPOC.", error: error.message });
  }
};

const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().select(
      "name description abbreviation image _id"
    );
    res.status(200).json(clubs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching clubs", error: error.message });
  }
};

const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate(
      "spoc",
      "name email"
    );
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.status(200).json(club);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching club", error: error.message });
  }
};

module.exports = {
  registerClub,
  updateClubInfo,
  changeSpoc,
  getAllClubs,
  getClubById,
};
