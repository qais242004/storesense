const express = require('express');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Nayi sale record karo (koi bhi logged-in user kar sakta hai)
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Product and quantity required' });
    }

    // Stock kam karo, lekin sirf tab jab stock kaafi ho
    const product = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );

    if (!product) {
      return res.status(400).json({ message: 'Product not found or not enough stock' });
    }

    const sale = await Sale.create({
      product: product._id,
      quantity,
      priceAtSale: product.price,
      total: product.price * quantity,
      soldBy: req.user.id,
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;