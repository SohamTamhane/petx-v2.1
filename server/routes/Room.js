const express = require('express');
const router = express.Router();

const { createRoom, fetchRoom, joinRoom, getRoomMembers, getUserDetails } = require('../controllers/Room');
const { auth, isSeller } = require('../middleware/Auth');

router.post('/create', auth, createRoom);
router.post('/:roomId/join', auth, joinRoom);
router.post('/fetch', auth, fetchRoom);
router.get('/members', auth, getRoomMembers);
router.post('/user', auth, getUserDetails);

module.exports = router;