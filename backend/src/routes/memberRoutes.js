const express = require("express");
const router = express.Router();

const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");
const {
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
} = require("../controllers/memberController");

// Semua route perlu login
router.use(authMiddleware);

// Member routes
router.get("/profile", getProfile);
router.get("/attendance", getAttendance);
router.get("/:id", getMember);
router.put("/:id", updateMember);

// Upload profile image
router.post("/profile-image", uploadMiddleware, handleUploadProfileImage);

// Admin only routes
router.use(adminOnly);
router.get("/", listMembers);
router.post("/", createMember);
router.delete("/:id", deleteMember);

//jojo

module.exports = router;
