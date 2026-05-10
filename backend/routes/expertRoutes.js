const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

router.get('/', expertController.getExperts);
router.get('/:id', expertController.getExpertById);

// Admin routes for testing
router.post('/', expertController.addExpert);
router.post('/slots', expertController.addSlots);

module.exports = router;
