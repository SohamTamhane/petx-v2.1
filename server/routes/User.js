const express = require('express');
const router = express.Router();

const { userDetails, becomeSeller, updateAddress, becomeCaretaker, updateDetails, addPet, updatePet, deletePet } = require('../controllers/User');
const { auth, isCaretaker } = require('../middleware/Auth');

router.get('/details', auth, userDetails);
router.get('/becomeSeller', auth, becomeSeller);
router.get('/becomeCaretaker', auth, becomeCaretaker);
router.post('/updateDetails', auth, isCaretaker, updateDetails);
router.post('/address/update', auth, updateAddress);
router.post('/managepets/addpet', auth, addPet);
router.post('/managepets/updatepet', auth, updatePet);
router.post('/managepets/deletepet', auth, deletePet);


module.exports = router;   