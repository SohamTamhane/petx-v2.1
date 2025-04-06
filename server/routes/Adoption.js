const express = require('express');
const { petCategory } = require('../controllers/Adoption');
const router = express.Router();

router.post('/category', petCategory);

module.exports = router;