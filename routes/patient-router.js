
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();
const { Patient } = require('../models/patients');

router.get('/', (req, res) => {
  Patient
    .find()
    .then(patients => {
      res.status(200).json(patients);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ["age", "room", "admitDate", "name"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Patient.create({
    room: req.body.room,
    admitDate: req.body.admitDate,
    age: req.body.age,
    name: req.body.name
  })
  .then(patient => {
    console.log("patient created");
    res.status(200).json({
      name: patient.name
    })
  })
})

router.delete('/:id', (req, res) => {
  Patient.findByIdAndRemove(req.params.id)
  .then(patient => res.status(204).json({ name: patient.name }))
  .catch(err => res.status(500).json({ message: "Internal server error"}))
})

module.exports = router;
