const Event = require("../models/eventModel");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const scheduleEmailJobs = require("../controllers/emailController");

const generateQR = async (data) => {
  const options = {
    errorCorrectionLevel: "H", // High error correction for better scanning
    type: "image/png",
    quality: 0.92,
    margin: 2, // Reduced margin for a cleaner look
    color: {
      dark: "#333333", // Dark gray for a more modern look
      light: "#F5F5F5", // Light gray as background for a subtle contrast
    },
    width: 128, // You can adjust this based on your requirement
    rendererOpts: {
      qrModuleSize: 8, // Smaller, more compact size of the individual blocks
    },
    scale: 4, // Makes the QR code image higher resolution
  };

  const qrCodeDataURL = await QRCode.toDataURL(data, options);

  // Optional: Adding a logo or icon in the center
  // Here you can add code for image overlay if needed

  return qrCodeDataURL;
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      fromDate,
      toDate,
      singleDayEvent,
      location,
      clubId,
      poster,
      seatsLimit,
    } = req.body;

    const event = new Event({
      title,
      description,
      fromDate,
      toDate,
      singleDayEvent,
      location,
      club: clubId,
      poster,
      seatsLimit,
      createdBy: req.user._id,
    });

    await event.save();

    const club = await Club.findById(clubId);
    club.events.push(event._id);

    await club.save();

    res.status(201).json({ message: "Event created successfully.", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating event.", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this event." });
    }

    const { eventId: id, createdBy, ...updateData } = req.body;
    Object.assign(event, updateData);
    await event.save();

    res.status(200).json({ message: "Event updated successfully.", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event.", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this event." });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event.", error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .select("-registeredStudents -createdBy")
      .populate("club", "name abbreviation");
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events.", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select("-registeredStudents -createdBy")
      .populate("club", "name abbreviation");

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching event.", error: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = event.registeredStudents.some(
      (registration) => registration.student.toString() === userId.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "You are already registered" });
    }
    if (event.filledSeats >= event.seatsLimit) {
      return res.status(400).json({ message: "Event is fully booked" });
    }

    let qrCodes = [];
    let currentDate = new Date(event.fromDate);
    while (currentDate <= event.toDate) {
      const qrData = JSON.stringify({
        studentId: userId,
        eventId: eventId,
        date: currentDate.toISOString(),
      });

      const qrCodeURL = await QRCode.toDataURL(qrData);
      // const qrCodeURL = await generateQR(qrData);

      qrCodes.push({
        date: new Date(currentDate),
        qrCode: qrCodeURL,
        expired: false,
        hasAttended: false,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    event.registeredStudents.push({
      student: userId,
      qrCodes,
    });

    await event.save();

    console.log("Event Saved. Scheduling Started.");
    scheduleEmailJobs();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: `Registration Confirmation for ${event.title}`,
      html: `<p>Thank you for registering for <strong>${event.title}</strong>.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Successfully registered. QR sent via email" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const registrationIndex = event.registeredStudents.findIndex((entry) =>
      entry.student.equals(studentId)
    );

    if (registrationIndex === -1) {
      return res
        .status(400)
        .json({ message: "You are not registered for this event." });
    }

    event.registeredStudents.splice(registrationIndex, 1);
    await event.save();

    res.status(200).json({ message: "Registration cancelled successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling registration.",
      error: error.message,
    });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate(
      "registeredStudents.student",
      "name email enrollmentNo department academicYear"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ registeredStudents: event.registeredStudents });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching registrations.", error: error.message });
  }
};

const checkRegistrationStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const isRegistered = event.registeredStudents.some((entry) =>
      entry.student.equals(studentId)
    );

    res.status(200).json({ isRegistered });
  } catch (error) {
    res.status(500).json({
      message: "Error checking registration status.",
      error: error.message,
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { eventId, studentId, date } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const student = event.registeredStudents.find(
      (s) => s.student.toString() === studentId.toString()
    );

    if (!student) {
      return res
        .status(400)
        .json({ message: "Student not registered for this event" });
    }

    const qrEntry = student.qrCodes.find(
      (qr) => new Date(qr.date).getTime() === new Date(date).getTime()
    );

    if (!qrEntry || qrEntry.expired) {
      return res.status(400).json({ message: "Invalid or expired QR code" });
    }

    qrEntry.expired = true;
    qrEntry.hasAttended = true;
    await event.save();

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate(
      "registeredStudents.student",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const presentStudents = event.registeredStudents.filter(
      (s) => s.hasAttended
    );
    const absentStudents = event.registeredStudents.filter(
      (s) => !s.hasAttended
    );

    res.status(200).json({
      _id: event._id,
      eventTitle: event.title,
      totalRegistered: event.registeredStudents.length,
      present: presentStudents.map((s) => s.student),
      absent: absentStudents.map((s) => s.student),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const reissueQrCode = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const currentDate = new Date();
    if (currentDate > new Date(event.toDate)) {
      return res.status(400).json({ message: "The event has already ended" });
    }

    const studentRecord = event.registeredStudents.find(
      (entry) => entry.student.toString() === userId.toString()
    );

    if (!studentRecord) {
      return res
        .status(400)
        .json({ message: "Student not registered for this event" });
    }

    if (studentRecord.hasAttended) {
      return res.status(400).json({
        message: "Attendance already marked. QR reissue is not allowed",
      });
    }

    if (studentRecord.qrReissueCount >= 1) {
      return res.status(400).json({ message: "QR reissue limit reached" });
    }

    const qrData = JSON.stringify({
      studentId: userId,
      eventId: eventId,
      expiry: new Date(event.toDate).getTime(),
    });

    const qrCodeURL = await QRCode.toDataURL(qrData);

    studentRecord.qrCode = qrCodeURL;
    studentRecord.qrReissueCount += 1;

    await event.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: `Your New QR Code for ${event.title}`,
      html: `<p>Your previous QR code has expired, and here is your new QR code for attendance at ${event.title}.</p>`,
      attachments: [
        {
          filename: "event-qr.png",
          content: qrCodeURL.split(",")[1],
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "QR code reissued successfully. Please check your email",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
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
  reissueQrCode,
};
