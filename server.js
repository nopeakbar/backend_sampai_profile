const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const bookRoutes = require("./routes/bookRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes"); // Pastikan file ini ada!
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);           // Auth: register, login
app.use("/api", protectedRoutes);           // Contoh: /api/secret
app.use("/api/books", bookRoutes);          // CRUD buku
app.use("/api/exchanges", exchangeRoutes);  // Fitur tukar buku
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to Buku Tukar API");
});

sequelize.sync().then(() => {
  console.log("✅ Database connected...");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error("❌ Error connecting to DB:", err);
});
