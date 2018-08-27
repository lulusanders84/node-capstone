
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
      res.status(200).json(user.assignmentList);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
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
        }).catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        })
    })
})

router.put('/assignment/:id', jsonParser, (req, res) => {
  const reportIds = req.body.map(id => {
    return id;
  })
    console.log("report ids", reportIds);
      User
        .findOneAndUpdate({userName: req.params.id}, {$pull: {assignmentList: { $in: reportIds }}})
        .then(user => {
          console.log("user", user.assignmentList);
          res.status(200).json(user);
        }).catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        })
    })

module.exports = router;
