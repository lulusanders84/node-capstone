
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();

const { User } = require('../models/users');
const { Report } = require('../models/reports');

router.get('/:id', (req, res) => {
  User
    .findOne({userName: req.params.id})
    .then(user => {
      res.status(200).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

router.get('/assignment/:id', (req, res) => {
  User
    .findOne({userName: req.params.id})
    .populate('assignmentList')
    .then(user => {
      console.log(user);
      res.status(200).json(user.assignmentList);
    })
})


router.put('/:id', jsonParser, (req, res) => {
  Report
    .find({patientId: { $in: req.body }})
    .then(reports => {
      const reportIds = reports.map(report => {
        return report._id;
      })
      User
        .findOneAndUpdate({userName: req.params.id}, {$push: {assignmentList: reportIds}})
        .then(user => {
          res.status(200);
        })
    })
})



module.exports = router;
