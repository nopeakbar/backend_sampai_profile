const Exchange = require("../models/Exchange");
const Book = require("../models/Book");

// Membuat permintaan tukar buku
exports.requestExchange = async (req, res) => {
  const { offeredBookId, requestedBookId } = req.body;
  const userId = req.user.id;

  try {
    // Cek buku milik user yang tawarkan
    const offeredBook = await Book.findOne({ where: { id: offeredBookId, userId } });
    if (!offeredBook)
      return res.status(400).json({ message: "Buku yang ditawarkan tidak ditemukan atau bukan milik Anda" });

    // Cek buku yang diminta ada
    const requestedBook = await Book.findByPk(requestedBookId);
    if (!requestedBook)
      return res.status(400).json({ message: "Buku yang diminta tidak ditemukan" });

    // Buat permintaan tukar
    const exchange = await Exchange.create({
      requesterId: userId,
      offeredBookId,
      requestedBookId,
      status: "pending",
    });

    res.status(201).json({ message: "Permintaan tukar berhasil dibuat", exchange });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat permintaan tukar", error: error.message });
  }
};

// Mendapatkan permintaan tukar yang diterima oleh user (buku diminta milik user)
exports.getReceivedExchanges = async (req, res) => {
  const userId = req.user.id;

  try {
    const exchanges = await Exchange.findAll({
      where: { status: "pending" },
      include: [
        { model: Book, as: "requestedBook", where: { userId } },
        { model: Book, as: "offeredBook" },
      ],
    });
    res.status(200).json({ exchanges });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil permintaan tukar", error: error.message });
  }
};

// Mendapatkan permintaan tukar yang dibuat oleh user
exports.getMyExchangeRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const exchanges = await Exchange.findAll({
      where: { requesterId: userId },
      include: [
        { model: Book, as: "offeredBook" },
        { model: Book, as: "requestedBook" },
      ],
    });
    res.status(200).json({ exchanges });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil permintaan tukar", error: error.message });
  }
};

// Update status permintaan tukar (accept / reject)
exports.updateExchangeStatus = async (req, res) => {
  const exchangeId = req.params.id;
  const userId = req.user.id;
  const { status } = req.body; // expected: "accepted" or "rejected"

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status harus 'accepted' atau 'rejected'" });
  }

  try {
    const exchange = await Exchange.findByPk(exchangeId, {
      include: [{ model: Book, as: "requestedBook" }],
    });
    if (!exchange) return res.status(404).json({ message: "Permintaan tukar tidak ditemukan" });

    // Pastikan user yang update status adalah pemilik buku yang diminta
    if (exchange.requestedBook.userId !== userId) {
      return res.status(403).json({ message: "Anda tidak berhak mengubah status ini" });
    }

    exchange.status = status;
    await exchange.save();

    res.status(200).json({ message: "Status permintaan tukar berhasil diupdate", exchange });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate status tukar", error: error.message });
  }
};
