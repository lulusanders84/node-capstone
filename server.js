
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { router: authRouter } = require("./auth/router");
const {localStrategy, jwtStrategy } = require("./auth/strategies");

const patientRouter = require('./routes/patient-router');
const reportRouter = require('./routes/report-router');
const userRouter = require('./routes/user-router');

const jwtAuth = passport.authenticate('jwt', {session: false});

app.use(express.static('public'));

app.use(morgan('common'));

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/patients', patientRouter);
app.use('/api/reports', reportRouter, jwtAuth);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect((databaseUrl, err) => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
          })
          .on(("error", err) => {
            mongoose.disconnect();
            reject(err);
          }
        );
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);;
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
