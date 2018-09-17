
"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const { DATABASE_URL } = require("../config");
const { app, runServer, closeServer } = require("../server");
const { User } = require('../models/users');

const expect = chai.expect;

chai.use(chaiHttp);

let testUser =
	{
	    "_id": {
	        "$oid": "5b9efcb5ee296f58842a1308"
	    },
	    "assignmentList": [],
	    "username": "testUser",
	    "password": "password",
	    "firstName": "Test",
	    "lastName": "User",
	    "__v": 0
	};

let authToken;

describe('user/auth router', function() {

	before(function() {
		return runServer(DATABASE_URL);
	});
	after(function() {
		return closeServer();
	});

	/*it('should sign up new user on POST', function() {
		return chai.request(app)
		.post("/api/users")
    .send({
     "username": "testUser",
     "password": "testPassword",
     "firstName": "Test",
     "lastName": "User"
     })
		.then(function(res) {
      testUser = res.body;
			expect(res).to.have.status(201);
		})
	})*/

	it('should send token on POST to auth/login', function() {
		return chai.request(app)
		.post("/api/auth/login")
		.send({
			"username": "testUser",
			"password": "testPassword"
		})
		.then(function(res) {
			authToken = res.body.authToken;
			expect(res).to.have.status(200);
		})
	})

	it('should retrieve user on GET', function() {
		return chai.request(app)
		.get(`/api/users/${testUser._id.$oid}`)
		.set("Authorization", `Bearer ${authToken}`)
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})

	it('should retrieve user assignment list on GET', function() {
		return chai.request(app)
		.get(`/api/users/assignment/${testUser._id.$oid}`)
		.set("Authorization", `Bearer ${authToken}`)
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})

	it('should add report to assignment list on PUT', function() {
		return chai.request(app)
		.put(`/api/users/${testUser._id.$oid}`)
		.set("Authorization", `Bearer ${authToken}`)
		.send(["5b842e962b73a5573d217efc"])
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})
})
