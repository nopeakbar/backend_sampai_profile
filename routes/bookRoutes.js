const express = require("express");
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getMyBooks,
  updateBook,
  deleteBook
} = require("../controllers/bookController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, addBook);
router.get("/", getAllBooks);
router.get("/me", authenticate, getMyBooks);
router.put("/:id", authenticate, updateBook);
router.delete("/:id", authenticate, deleteBook);

module.exports = router;
