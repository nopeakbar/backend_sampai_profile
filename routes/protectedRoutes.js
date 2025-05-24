const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

router.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Ini konten rahasia!",
    user: req.user, // Data dari token JWT
  });
});

module.exports = router;
