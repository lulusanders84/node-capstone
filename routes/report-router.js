
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();
const { Report } = require('../models/reports');

router.get('/:id', (req, res) => {
  Report
    .findOne({patientId: req.params.id})
    .then(report => {
      res.status(200).json(report);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

module.exports = router;
