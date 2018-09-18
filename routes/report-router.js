
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();
const { Report } = require('../models/reports');
const { Patient } = require('../models/patients');

router.get('/:id', (req, res) => {
  Report
    .findById(req.params.id)
    .then(reportById => {
      res.status(200).json(reportById);
    }).catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    })
})

router.put('/', jsonParser, (req, res) => {
  console.log(req.body);
  Report
    .findOneAndUpdate({_id: req.body.reportId}, {$set: req.body.data})
    .then(report => {
      Report
      .findById(report._id)
      .then(report => {
      res.status(200).json(report);
    }).catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
  })
})

module.exports = router;
