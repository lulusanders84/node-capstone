
const express = require('express');
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();
const { Patient } = require('../models/patients');
const { Report } = require('../models/reports');

router.get('/', (req, res) => {
  Patient
    .find()
    .populate("report")
    .then(patients => {
      res.status(200).json(patients);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

function createNewPatient(req, res, report) {
  Patient
    .create({
      report: report
    }).then(patient => {
        console.log("patient", patient);
        res.status(200).json(patient.report.name);
      }).catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
      })
}


router.post('/', jsonParser, (req, res) => {
  const requiredFields = ["age", "room", "admitDate", "name"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Report
    .findOne({name: req.body.name})
    .then(report => {
      console.log("report", report);
      if(report === null) {
        Report
          .create({
            room: req.body.room,
            admitDate: req.body.admitDate,
            age: req.body.age,
            name: req.body.name
          })
          .then(newReport => {
            createNewPatient(req, res, newReport);
          })
      } else {
        createNewPatient(req, res, report);
        console.log(reportToAddToPatients);
      }
    })
})

router.delete('/:id', (req, res) => {
  Patient.findByIdAndRemove(req.params.id)
  .then(patient => res.status(204).json({ name: patient.name }))
  .catch(err => res.status(500).json({ message: "Internal server error"}))
})

module.exports = router;
