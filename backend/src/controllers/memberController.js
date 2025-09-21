const { Member, Membership, Attendance } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =======================
// Multer untuk profile image
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'profiles');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const uploadMiddleware = multer({ storage }).single("profileImage");

// =======================
// CRUD Member
// =======================
async function createMember(req, res) {
  try {
    const { fullName, email, phone } = req.body;
    const member = await Member.create({ fullName, email, phone });
    return res.status(201).json({ message: "Member created", data: member });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error creating member" });
  }
}

async function listMembers(req, res) {
  const members = await Member.findAll({ include: { model: Membership, as: "membership" } });
  res.json(members);
}

async function getMember(req, res) {
  const member = await Member.findByPk(req.params.id, { include: { model: Membership, as: "membership" } });
  res.json(member);
}

async function updateMember(req, res) {
  const member = await Member.findByPk(req.params.id);
  await member.update(req.body);
  res.json({ message: "Member updated", data: member });
}

async function deleteMember(req, res) {
  const member = await Member.findByPk(req.params.id);
  await member.destroy();
  res.json({ message: "Member deleted" });
}

// =======================
// Profil & Attendance
// =======================
async function getProfile(req, res) {
  const member = await Member.findByPk(req.user.id, { include: { model: Membership, as: "membership" } });
  res.json(member);
}

async function getAttendance(req, res) {
  const attendance = await Attendance.findAll({ where: { memberId: req.user.id } });
  res.json(attendance);
}

// =======================
// Dashboard Admin
// =======================
async function getDashboardData(req, res) {
  const totalMembers = await Member.count();
  res.json({ totalMembers });
}

// =======================
// Upload Profile Image
// =======================
async function handleUploadProfileImage(req, res) {
  try {
    const member = await Member.findByPk(req.user.id);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Hapus foto lama
    if (member.profilePictureUrl) {
      const oldPath = path.join(__dirname, '..', '..', member.profilePictureUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    member.profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
    await member.save();
    return res.json({ message: "Profile image updated", data: member });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error uploading profile image" });
  }
}

module.exports = {
  createMember,
  listMembers,
  getMember,
  updateMember,
  deleteMember,
  getProfile,
  getAttendance,
  getDashboardData,
  uploadMiddleware,
  handleUploadProfileImage
};
