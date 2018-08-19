
const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

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

module.exports = router;
