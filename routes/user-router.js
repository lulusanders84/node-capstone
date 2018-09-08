
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();

const { User } = require('../models/users');
const { Report } = require('../models/reports');
const { Patient } = require('../models/patients');

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
      console.log("user:", user);
      res.status(200).json(user.assignmentList);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})


router.put('/:id', jsonParser, (req, res) => {
  Patient
    .find({_id: { $in: req.body }})
    .then(patients => {
      console.log("patients", patients);
      const reportIds = patients.map(patient => {
        return patient.report;
      })
      User
        .findOneAndUpdate({userName: req.params.id}, {$push: {assignmentList: reportIds}})
        .populate("assignmentList")
        .then(user => {
          res.status(200).json(user.assignmentList);
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
