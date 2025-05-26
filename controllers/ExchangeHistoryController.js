import ExchangeHistory from '../models/ExchangeHistory.js';
import Exchange        from '../models/Exchange.js';

/**
 * POST /exchanges/history
 * Tambah entri history dan tandai exchange sebagai completed
 */
export const addExchangeHistory = async (req, res) => {
  const { exchangeRequestId } = req.body;
  try {
    const exchange = await Exchange.findByPk(exchangeRequestId);
    if (!exchange) {
      return res.status(404).json({
        status: 'Error',
        message: 'Exchange request tidak ditemukan'
      });
    }

    const history = await ExchangeHistory.create({
      exchangeRequestId,
      completed_at: new Date()
    });

    exchange.status = 'completed';
    await exchange.save();

    return res.status(201).json({
      status: 'Success',
      message: 'Exchange berhasil diselesaikan dan dicatat di history',
      data: history
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mencatat exchange history',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/history
 * Ambil semua history
 */
export const getAllExchangeHistory = async (req, res) => {
  try {
    const histories = await ExchangeHistory.findAll({
      include: {
        model: Exchange,
        as: 'exchange',
        attributes: ['id','requesterId','ownerId','status']
      },
      order: [['completed_at','DESC']]
    });
    return res.status(200).json({ status: 'Success', data: histories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil exchange history',
      error: error.message
    });
  }
};

/**
 * GET /exchanges/history/:id
 * Ambil 1 history by ID
 */
export const getExchangeHistoryById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const history = await ExchangeHistory.findByPk(id, {
      include: {
        model: Exchange,
        as: 'exchange',
        attributes: ['id','requesterId','ownerId','status']
      }
    });
    if (!history) {
      return res.status(404).json({
        status: 'Error',
        message: 'History tidak ditemukan'
      });
    }
    return res.status(200).json({ status: 'Success', data: history });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'Error',
      message: 'Gagal mengambil exchange history',
      error: error.message
    });
  }
};
