const express = require('express');
const router = express.Router();

const { createRoom } = require('../controllers/Room');
const { auth, isSeller } = require('../middleware/Auth');

router.post('/create', auth, createRoom);

module.exports = router;