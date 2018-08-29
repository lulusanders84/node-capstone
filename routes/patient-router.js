
const express = require('express');
const mongoose = require("mongoose");
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
          }).then(newReport => {
            console.log("new report", newReport);
            Patient
              .create({
                report: newReport._id
              }).then(patient => {
                Patient
                .findById(patient._id)
                .populate("report")
                .then(unitPatient => {
                  res.status(200).json(unitPatient.name);
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({message: 'Internal server error'});
                })
              })
          })
      }else {
        json.status(204).json({})
      }
    })

.then(patient => {
    Report.create({
      patientId: patient._id,
      room: patient.room,
      admitDate: patient.admitDate,
      age: patient.age,
      name: patient.name
    })
    .then(report => {
      console.log("report created", report);
      res.status(200).json({
        name: report.name
      })
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
  })
})

router.delete('/:id', (req, res) => {
  Patient.findByIdAndRemove(req.params.id)
  .then(patient => res.status(204).json({ name: patient.name }))
  .catch(err => res.status(500).json({ message: "Internal server error"}))
})

module.exports = router;
