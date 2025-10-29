const Booking = require('../models/Booking');
const { CAR_MODELS, CARS, BRANCHES } = require('../constants');
const { getDistance } = require('geolib');

// @desc    Calculate booking price
// @route   POST /api/bookings/calculate-price
exports.calculatePrice = async (req, res) => {
    const { carId, startDate, endDate, options, deliveryOption, deliveryLocation } = req.body;
    try {
        const carInstance = CARS.find(c => c.id === carId);
        const carModel = CAR_MODELS.find(m => m.key === carInstance?.modelKey);
        if (!carModel || !carInstance) return res.status(404).json({ msg: 'Car not found' });
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        let deliveryFee = 0;
        let deliveryError = '';
        if (deliveryOption !== 'branch' && deliveryLocation) {
            const branch = BRANCHES.find(b => b.id === carInstance.branchId);
            if (branch?.lat && branch.lng) {
                const distanceMeters = getDistance(
                    { latitude: branch.lat, longitude: branch.lng },
                    { latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }
                );
                const distanceKm = distanceMeters / 1000;
                if (distanceKm > 40) {
                    deliveryError = 'الموقع المحدد خارج نطاق خدمة التوصيل (40 كم).';
                } else {
                    const feePerTrip = 10 + (distanceKm * 0.5);
                    if (deliveryOption === 'delivery') deliveryFee = feePerTrip;
                    if (deliveryOption === 'delivery_pickup') deliveryFee = feePerTrip * 2;
                }
            }
        }
        
        const base = carModel.daily_price * days;
        const insuranceCost = options.insurance ? (50 * days) : 0;
        let extrasTotal = 0;
        if (options.extra_driver) extrasTotal += 50;
        if (options.child_seat) extrasTotal += 30;
        if (options.internationalPermit) extrasTotal += 100;
        
        const subtotal = base + insuranceCost + extrasTotal + Math.round(deliveryFee);
        const tax = subtotal * 0.15;
        const total = subtotal + tax;

        res.json({
            days,
            deliveryError,
            priceBreakdown: { base, insurance: insuranceCost, extras: extrasTotal, delivery: Math.round(deliveryFee), tax, total }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    const bookingData = req.body;
    try {
        const newBooking = new Booking({
            ...bookingData,
            userId: req.user.id,
            bookingNumber: `MAS-${Math.floor(Math.random() * 90000) + 10000}`,
        });
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// ... other controllers like updateBooking, getAllBookings (for admin)
