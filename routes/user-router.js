
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();
const { User } = require('../models/users');

router.get('/:id', (req, res) => {
  User
    .findOne({userName: req.params.id})
    .then(user => {
      console.log(user);
      res.status(200).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

module.exports = router;
