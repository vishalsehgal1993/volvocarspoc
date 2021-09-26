const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    scheduledTime: {
      type: String,
      required: true
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    vin: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
