const express = require('express');
const router = express.Router();

const { userDetails, becomeSeller, updateAddress, becomeCaretaker } = require('../controllers/User');
const { auth } = require('../middleware/Auth');

router.get('/details', auth, userDetails);
router.get('/becomeSeller', auth, becomeSeller);
router.get('/becomeCaretaker', auth, becomeCaretaker);
router.post('/address/update', auth, updateAddress);

module.exports = router;