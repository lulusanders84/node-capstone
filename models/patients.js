
const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
  "room": 'number',
  "admitDate": 'string',
  "name": 'string',
  "age": 'number',
  "service": 'string',
  "allergies": 'string',
  "code": 'string',
  "isolation": 'string',
  "diagnosis": 'string',
  "history": 'string',
  "GU": 'string',
  "GI": 'string',
  "fluids": 'string',
  "input": 'number',
  "output": 'number',
  "O2": 'string',
  "telemetry": 'string',
  "pain": 'number',
  "SCDs": 'boolean',
  "TED": 'boolean',
  "assist": 'string',
  "skinWounds": 'string',
  "hemo": 'number',
  "wbc": 'number',
  "plt": 'number',
  "K": 'number',
  "Na": 'number',
  "Cr": 'number'
});

const Patient= mongoose.model('Patient', patientSchema);

module.exports = { Patient };
