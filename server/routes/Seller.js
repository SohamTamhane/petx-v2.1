const express = require('express');
const router = express.Router();

const { auth, isSeller } = require('../middleware/Auth');
const { addProduct, deleteProduct, updateProduct, updateOrderStatus } = require('../controllers/Seller');

router.post('/product/add', auth, isSeller, addProduct);
router.post('/product/delete', auth, isSeller, deleteProduct);
router.post('/product/update', auth, isSeller, updateProduct);
router.post('/order/updateStatus', auth, isSeller, updateOrderStatus);

module.exports = router;