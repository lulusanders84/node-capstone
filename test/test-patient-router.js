
"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const { DATABASE_URL } = require("../config");
const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

let patientId;
let reportId;

chai.use(chaiHttp);

describe('patient router', function() {

  it('should retreive patients on GET', function() {
    return chai.request(app)
    .get('/api/patients')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    })
  })

  it('should create new patient on POST', function() {
    return chai.request(app)
    .post('/api/patients')
    .send({"name": "Test Patient", "age": 54, "admitDate": "09/15/2018", "room": 3501})
    .then(function(res) {
      reportId = res.body.report._id;
      patientId = res.body._id;
      return chai.request(app)
      .delete(`/api/patients/${patientId}`)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
      return chai.request(app)
      .delete(`/api/reports/${reportId}`)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
    })
    })
  })
