const mongoose = require('mongoose');

const PriceBreakdownSchema = new mongoose.Schema({
  base: { type: Number, required: true },
  insurance: { type: Number, required: true },
  extras: { type: Number, required: true },
  delivery: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  carId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branchId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  options: {
    insurance: { type: Boolean, default: false },
    extra_driver: { type: Boolean, default: false },
    open_km: { type: Boolean, default: false },
    child_seat: { type: Boolean, default: false },
    internationalPermit: { type: Boolean, default: false },
  },
  priceBreakdown: PriceBreakdownSchema,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  documents: {
    license: { type: String },
    licenseExpiry: { type: String, required: true },
    id_card: { type: String },
  },
  contact: {
    phone1: { type: String, required: true },
    phone2: { type: String },
    address: { type: String, required: true },
  },
  notes: { type: String },
  deliveryOption: {
    type: String,
    enum: ['branch', 'delivery', 'delivery_pickup'],
    required: true,
  },
  deliveryLocation: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'stc_pay', 'apple_pay'],
    required: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: true }
});

module.exports = mongoose.model('Booking', BookingSchema);
