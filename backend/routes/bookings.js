const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    calculatePrice, 
    createBooking, 
    getBookings,
    // updateBooking,
    // getAllBookings
} = require('../controllers/bookingController');

// @route   POST api/bookings/calculate-price
// @desc    Calculate booking price
// @access  Public (or Private if needed)
router.post('/calculate-price', calculatePrice);

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, createBooking);

// @route   GET api/bookings
// @desc    Get current user's bookings
// @access  Private
router.get('/', auth, getBookings);

// Add routes for admin to get all bookings, and for updating a booking
// router.get('/all', auth, adminCheck, getAllBookings);
// router.put('/:id', auth, updateBooking);

module.exports = router;
