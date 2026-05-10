const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.get('/', bookingController.getBookings);

module.exports = router;
