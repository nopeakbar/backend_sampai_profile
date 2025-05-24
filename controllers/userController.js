const { Op } = require("sequelize");
const User = require("../models/User");

// 🔍 Search user berdasarkan username
exports.searchUsers = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Query parameter 'username' harus diisi" });
  }

  try {
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${username}%`  // partial match
        }
      },
      attributes: ['id', 'username', 'email', 'avatar_url'] // Tambahkan avatar_url biar bisa ditampilkan
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Gagal mencari user", error: error.message });
  }
};

// 📝 Update profil user (username, email, avatar_url)
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email, avatar_url } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.avatar_url = avatar_url || user.avatar_url;

    await user.save();

    res.status(200).json({ message: "Profil berhasil diperbarui", user });
  } catch (error) {
    res.status(500).json({ message: "Gagal update profil", error: error.message });
  }
};
