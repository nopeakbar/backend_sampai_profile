const Book = require("../models/Book");

// Tambah buku
exports.addBook = async (req, res) => {
  const { title, author, description, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const book = await Book.create({
      title,
      author,
      description,
      imageUrl,
      userId,
    });

    res.status(201).json({ message: "Buku berhasil ditambahkan", book });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan buku", error: error.message });
  }
};

// Ambil semua buku
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ include: ["User"] });
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil buku", error: error.message });
  }
};

// Ambil buku milik user saat ini
exports.getMyBooks = async (req, res) => {
  const userId = req.user.id;
  try {
    const books = await Book.findAll({ where: { userId } });
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil buku", error: error.message });
  }
};

// Update buku by id
exports.updateBook = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;
  const { title, author, description, imageUrl } = req.body;

  try {
    const book = await Book.findOne({ where: { id: bookId, userId } });
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan atau bukan milik Anda" });

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.imageUrl = imageUrl || book.imageUrl;

    await book.save();

    res.status(200).json({ message: "Buku berhasil diupdate", book });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate buku", error: error.message });
  }
};

// Delete buku by id
exports.deleteBook = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;

  try {
    const book = await Book.findOne({ where: { id: bookId, userId } });
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan atau bukan milik Anda" });

    await book.destroy();

    res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus buku", error: error.message });
  }
};
