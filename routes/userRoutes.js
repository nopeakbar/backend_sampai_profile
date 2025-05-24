const express = require("express");
const router = express.Router();
const { searchUsers, updateProfile } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

router.get("/search", authenticate, searchUsers);
router.put("/profile", authenticate, updateProfile);

module.exports = router;
