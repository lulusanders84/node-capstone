
const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  "report": { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },

});

patientSchema.pre('find', function(next) {
  this.populate('report');
  next();
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Patient };
