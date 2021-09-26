const {validateTimeSlots} = require('../../utils/constants');
const Customer = require('../../models/user');
const Booking = require('../../models/booking');
const Vehicle = require('../../models/vehicle');

const user = async userId => {
  try {
    const user = await Customer.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      bookings: bookings.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const bookings = async bookingIds => {
  try {
    const bookings = await Booking.find({ _id: { $in: bookingIds } });
    bookings.map(booking => {
      return {
        ...booking._doc,
        _id: booking.id,
        date: new Date(booking._doc.date).toISOString(),
        creator: user.bind(this, booking.creator)
      };
    });
    return bookings;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId);
      await Booking.deleteOne({ _id: args.bookingId });
      return booking;
    } catch (err) {
      throw err;
    }
  }
};
