
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');

const router = express.Router();
const jsonParser = bodyParser.json();

const { User } = require('../models/users');
const { Report } = require('../models/reports');
const { Patient } = require('../models/patients');

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/:id', (req, res) => {
  User
    .findOne({"_id": req.params.id})
    .then(user => {
      res.status(200).json(user);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

router.get('/assignment/:id', jwtAuth, (req, res) => {
  User
    .findOne({_id: req.params.id})
    .populate('assignmentList')
    .then(user => {
      res.status(200).json(user.assignmentList);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

function removeDuplicateIds(req) {

}

router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  // let tracking = [];
  // let newReportIds = [];
  // let reportIds = [];
  Patient
    .find({_id: { $in: req.body }})
    .then(patients => {
      return patients.map(patient => {
        return patient.report._id;
      })
        // User
        // .findOne({_id: req.params.id})
        // .then(user => {
        //   if(user.assignmentList.length !== 0) {
        //     reportIds.forEach(id => {
        //       user.assignmentList.forEach(listItem => {
        //         if(!id.equals(listItem)) {
        //           tracking.push({match: false, id, listItem});
        //         } else if(id.equals(listItem)) {
        //           tracking.push({match: true, id, listItem});
        //         }
        //       })
        //     })
        //     newReportIds = tracking.reduce((acc, item) => {
        //       if(item.match === false) {
        //         acc.push(item.id);
        //       }
        //       return acc;
        //     }, [])
        //   }
        //   else {
        //   console.log(reportIds);
        //   newReportIds = reportIds;
        //   }
        //   return newReportIds;
        })
        .then(reportIds => {
          User
          .findOneAndUpdate({_id: req.params.id}, {$addToSet: {assignmentList: reportIds}}, {new: true})
          .populate("assignmentList")
          .then(user => {
            res.status(200).json({
              reportIds: reportIds,
              message: "Patients added to assignment list",
              assignmentList: user.assignmentList
            });
            tracking = [];
            newReportIds = [];
          }).catch(err => {
              console.error(err);
              res.status(500).json({message: 'Internal server error'});
          })
        })
    })
})


router.put('/assignment/:id', jsonParser, jwtAuth, (req, res) => {
  const reportIds = req.body.map(id => {
    return id;
  })

      User
        .findOneAndUpdate({_id: req.params.id}, {$pull: {assignmentList: { $in: reportIds }}}, {new: true})
        .then(user => {
          res.status(200).json(user.assignmentList);
        }).catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        })
    })

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }

    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      });
    }

    // If the username and password aren't trimmed we give an error.  Users might
    // expect that these will work without trimming (i.e. they want the password
    // "foobar ", including the space at the end).  We need to reject such values
    // explicitly so the users know what's happening, rather than silently
    // trimming them and expecting the user to understand.
    // We'll silently trim the other fields, because they aren't credentials used
    // to log in, so it's less of a problem.
    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      });
    }

    const sizedFields = {
      username: {
        min: 1
      },
      password: {
        min: 8,
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72
      }
    };
    const tooSmallField = Object.keys(sizedFields).find(
      field =>
        'min' in sizedFields[field] &&
              req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
      field =>
        'max' in sizedFields[field] &&
              req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField
          ? `Must be at least ${sizedFields[tooSmallField]
            .min} characters long`
          : `Must be at most ${sizedFields[tooLargeField]
            .max} characters long`,
        location: tooSmallField || tooLargeField
      });
    }

    let {username, password, firstName = '', lastName = ''} = req.body;
    // username and password come in pre-trimmed, otherwise we throw an error
    // before this
    firstName = firstName.trim();
    lastName = lastName.trim();
    User.find({username: username})
      .count()
      .then(count => {
        if (count > 0) {
          // There is an existing user with the same username
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'username already taken',
            location: 'username'
          });
        }
        // If there is no existing user, hash the password
        const hash = User.hashPassword(password);
        hash.then(hash => {
          User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName,
          assignmentList: []
        })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error', err: err});
    });
  });
});
});

router.delete('/:id', jsonParser, (req, res) => {
  User
  .findByIdAndDelete(req.params.id)
  .then(user => {
    res.status(200).json(user);
  })
});
module.exports = router;
