const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // bisa dipakai di route selanjutnya
    next();
  } catch (err) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

module.exports = authMiddleware;
