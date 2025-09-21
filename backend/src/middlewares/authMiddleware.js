function authMiddleware(req, res, next) {
  // Dummy login, nanti ganti pakai JWT
  req.user = { id: 1, role: "member" }; 
  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

module.exports = { authMiddleware, adminOnly };
