
const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  "report": { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },

});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Patient };
