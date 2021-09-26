const {validateTimeSlots} = require('../../utils/constants');
const Customer = require('../../models/user');
const Booking = require('../../models/booking');
const Vehicle = require('../../models/vehicle');

module.exports = {
  bookings: async args => {
    try {
      const existingUser = await Customer.findById({ _id: args.userID });
      if (!existingUser|| existingUser === undefined || existingUser === null) {
        throw new Error('User Does Not exists.');
      }
      const validateCars = await Vehicle.findById({_id:args.vin});
      if(!validateCars || validateCars === undefined || validateCars === null){
        throw new Error('Invalid Car Details');
      }
      const validateTime = validateTimeSlots(args.scheduledTime);
      console.log("validateTime is:", validateTime);
      if(!validateTime){
        throw new Error('Invalid Time Slots or Slots Unavailable');
      }
      const bookings = new Booking({
        userID: args.userID,
        scheduledTime: args.scheduledTime,
        vin:args.vin
      });
      const result = await bookings.save();
      return { ...result._doc, password: null, _id: result._id };
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
