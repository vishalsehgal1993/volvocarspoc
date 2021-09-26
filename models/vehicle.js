const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  vehicleMake: {
    type: String,
    required: true
  },
  vehicleModel: {
    type: String,
    required: true
  },
  vin: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
