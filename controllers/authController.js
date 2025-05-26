import User from '../models/User.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: "Register berhasil", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Wrong password" });

    const userPayload = { id: user.id, email: user.email };

  
    // authController.js — login
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'15m' });
// pastikan ACCESS_TOKEN_SECRET di .env sama dengan di middleware


    // Generate refresh token (umur panjang)
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Simpan refresh token ke DB
    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

    // Simpan refresh token ke cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true di production (HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Kirim access token ke client
    res.status(200).json({
      status: "Success",
      message: "Login successful",
      accessToken,
    });

  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.userId;
    await User.update({ refresh_token: null }, { where: { id: userId } });
    res.status(200).json({ message: "Logout berhasil dan token dibersihkan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
