
const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  "room": { type: 'number', default: '' },
  "admitDate": { type: 'string', default: '' },
  "dischargeDate": { type: 'string', default: '' },
  "age": { type: 'number', default: '' },
  "name": { type: 'string', default: '' },
  "allergies": { type: 'string', default: '' },
  "code": { type: 'string', default: '' },
  "isolation": { type: 'string', default: '' },
  "diagnosis": { type: 'string', default: '' },
  "history": { type: 'string', default: '' },
  "GU": { type: 'string', default: '' },
  "GI": { type: 'string', default: '' },
  "diet": { type: 'string', default: '' },
  "fluids": { type: 'string', default: '' },
  "input": { type: 'number', default: '' },
  "output": { type: 'number', default: '' },
  "O2": { type: 'string', default: '' },
  "telemetry": { type: 'string', default: '' },
  "pain": { type: 'number', default: '' },
  "SCDs": { type: 'string', default: '' },
  "TED": { type: 'string', default: '' },
  "assist": { type: 'string', default: '' },
  "skinWounds": { type: 'string', default: '' },
  "hemo": { type: 'number', default: '' },
  "wbc": { type: 'number', default: '' },
  "plt": { type: 'number', default: '' },
  "K": { type: 'number', default: '' },
  "Na": { type: 'number', default: '' },
  "Cr": { type: 'number', default: '' }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = { Report };
