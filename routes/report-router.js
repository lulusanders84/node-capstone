
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
      if(report === null) {
        Report
          .findById(req.params.id)
          .then(reportById => {
            res.status(200).json(reportById);
          })
      } else {
        res.status(200).json(report);
      }
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

module.exports = router;
