const express = require('express');
const router = express.Router();

const { productCategory, productDetails, addtoCartProduct, removeFromCartProduct } = require('../controllers/Marketplace');
const { auth } = require('../middleware/Auth');

router.post('/category', productCategory);
router.post('/product', productDetails);
router.post('/cart/add', auth, addtoCartProduct);
router.post('/cart/remove', auth, removeFromCartProduct);

module.exports = router;