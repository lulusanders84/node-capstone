"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const { DATABASE_URL } = require("../config");
const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

let patient;

let reportId = "5b7c512d2b73a5573db17387";
chai.use(chaiHttp);

describe('report router', function() {

	before(function() {
		return runServer(DATABASE_URL);
	});
	after(function() {
		return closeServer();
	});

	it('should retrieve report on GET', function() {
		return chai.request(app)
		.get(`/api/reports/${reportId}`)
		.then(function(res) {
			expect(res).to.have.status(200);
      expect(res).to.be.json;
		})
	})

	it('should update report on PUT', function() {
    return chai.request(app)
    .post('/api/patients')
    .send({"name": "Test Patient", "age": 54, "admitDate": "09/15/2018", "room": 3501})
    .then(function(res) {
      reportId = res.body.report._id;
      return chai.request(app)
      .put("/api/reports")
      .send({
        "reportId": reportId,
        "data": {"age": 62}
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      })
    })
	})
})
