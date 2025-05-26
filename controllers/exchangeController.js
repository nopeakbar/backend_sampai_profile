import Exchange from '../models/Exchange.js';
import Book     from '../models/Book.js';
import User     from '../models/User.js';

/**
 * POST /exchanges
 * Buat permintaan tukar buku
 */
export const requestExchange = async (req, res) => {
  const requesterId    = req.userId;
  const { offeredBookId, requestedBookId, messages, location, meetingDatetime } = req.body;

  try {
    // verifikasi buku yang ditawarkan milik requester
    const offeredBook = await Book.findOne({
      where: { id: offeredBookId, userId: requesterId }
    });
    if (!offeredBook) {
      return res.status(400).json({
        status: 'Error',
        message: 'Buku yang ditawarkan tidak ditemukan atau bukan milik Anda'
      });
    }

    // verifikasi buku diminta ada & ambil owner
    const requestedBook = await Book.findByPk(requestedBookId);
    if (!requestedBook) {
      return res.status(400).json({
        status: 'Error',
        message: 'Buku yang diminta tidak ditemukan'
      });
    }
    const ownerId = requestedBook.userId;

    const exchange = await Exchange.create({
      requesterId,
      ownerId,
      offeredBookId,
      requestedBookId,
      messages: messages || null,
      location: location || null,
      meetingDatetime: meetingDatetime || null,
      status: 'pending'
    });

    return res.status(201).json({
      status: 'Success',
      message: 'Permintaan tukar berhasil dibuat',
      data: exchange
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal membuat permintaan tukar',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/received
 * Ambil semua request masuk (pending) untuk buku user
 */
export const getReceivedExchanges = async (req, res) => {
  const ownerId = req.userId;
  try {
    const exchanges = await Exchange.findAll({
      where: { ownerId, status: 'pending' },
      include: [
        { model: Book, as: 'offeredBook' },
        { model: Book, as: 'requestedBook' },
        { model: User, as: 'requester', attributes: ['id','username','avatar_url'] }
      ],
      order: [['createdAt','DESC']]
    });
    return res.status(200).json({ status: 'Success', data: exchanges });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil permintaan tukar masuk',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/sent
 * Ambil semua request yang dibuat user (sudah atau belum diproses)
 */
export const getMyExchangeRequests = async (req, res) => {
  const requesterId = req.userId;
  try {
    const exchanges = await Exchange.findAll({
      where: { requesterId },
      include: [
        { model: Book, as: 'offeredBook' },
        { model: Book, as: 'requestedBook' },
        { model: User, as: 'owner', attributes: ['id','username','avatar_url'] }
      ],
      order: [['createdAt','DESC']]
    });
    return res.status(200).json({ status: 'Success', data: exchanges });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil permintaan tukar Anda',
      error: error.message
    });
  }
};

/**
 * PUT /exchanges/:id
 * Update status permintaan tukar (accept/decline)
 */
export const updateExchangeStatus = async (req, res) => {
  const exchangeId = Number(req.params.id);
  const userId     = req.userId;
  const { status } = req.body;

  if (!['accepted','declined'].includes(status)) {
    return res.status(400).json({
      status: 'Error',
      message: "Status harus 'accepted' atau 'declined'"
    });
  }

  try {
    const exchange = await Exchange.findByPk(exchangeId);
    if (!exchange) {
      return res.status(404).json({ status: 'Error', message: 'Permintaan tukar tidak ditemukan' });
    }
    if (exchange.ownerId !== userId) {
      return res.status(403).json({ status: 'Error', message: 'Anda tidak berhak mengubah status ini' });
    }

    exchange.status = status;
    await exchange.save();
    return res.status(200).json({
      status: 'Success',
      message: 'Status permintaan tukar berhasil diupdate',
      data: exchange
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengupdate status tukar',
      error: error.message
    });
  }
};
