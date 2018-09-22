
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");

app.get('/api/patients', (req, res) => {
  Patients
  .find({})
  .then(patients => {
    res.status(200).json(patients)
  })
  .catch(err => {
    res.status(500).json({message: 'Internal server error'})
  })
})

if (require.main === module) {
  app.listen(process.env.PORT || 3050, function() {
    console.info(`App listening on ${this.address().port}`);
  });
}

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
          })
          .on("error", err => {
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
