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
      if(!validateTime){
        throw new Error('Invalid Time Slots or Slots Unavailable');
      }
      const checkCounts = (await Booking.find(args)).length;
      if(checkCounts>=2){
        throw new Error('All Time Slots are Booked Please Book Other Date Time Values');
      }
      const bookings = new Booking({
        userID: args.userID,
        scheduledTime: args.scheduledTime,
        vin:args.vin
      });
      const result = await bookings.save();
      return result;
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args._id);
      if(!booking || booking === null || booking === undefined){
        throw new Error('Bookings Does Not exists.');
      }
      const recDeleted = await Booking.deleteOne(booking);
      return booking;
    } catch (err) {
      throw err;
    }
  },
  bookingList: async args => {
    try {
      const booking = await Booking.find(args);
      if(!booking || booking === null || booking === undefined || booking.length === undefined || booking.length == 0){
        throw new Error('Bookings Does Not exists.');
      }
      return booking;
    } catch (err) {
      throw err;
    }
  }
};
