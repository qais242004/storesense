const express = require('express');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Dashboard ke numbers (koi bhi logged-in user dekh sakta hai)
router.get('/summary', protect, async (req, res) => {
  try {
    // Aaj subah 12 baje ka waqt
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Aaj ki sales ka hisaab
    const todayResult = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$total' },
          totalItems: { $sum: '$quantity' },
          salesCount: { $sum: 1 },
        },
      },
    ]);

    const today = todayResult[0] || { totalAmount: 0, totalItems: 0, salesCount: 0 };

    // Maal ki kul tadad
    const totalProducts = await Product.countDocuments();

    // Kam stock wala maal (5 ya us se kam), sab se kam wala pehle
    const lowStock = await Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 });

    res.json({
      todayAmount: today.totalAmount,
      todayItems: today.totalItems,
      todaySalesCount: today.salesCount,
      totalProducts,
      lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;