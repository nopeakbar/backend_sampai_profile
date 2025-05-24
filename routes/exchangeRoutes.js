const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  requestExchange,
  getReceivedExchanges,
  getMyExchangeRequests,
  updateExchangeStatus,
} = require("../controllers/exchangeController");

router.post("/", authenticate, requestExchange);
router.get("/received", authenticate, getReceivedExchanges);
router.get("/sent", authenticate, getMyExchangeRequests);
router.put("/:id", authenticate, updateExchangeStatus);

module.exports = router;
