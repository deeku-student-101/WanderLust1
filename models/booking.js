const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  checkIn: {
    type: Date,
    required: true
  },

  checkOut: {
    type: Date,
    required: true
  },

  guests: {
    type: Number,
    default: 1
  },

  totalPrice: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    enum: ["Online", "Cash on Check-in"],
    default: "Cash on Check-in"
  },

  bookingStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);