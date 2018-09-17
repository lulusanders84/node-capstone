
"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const { DATABASE_URL } = require("../config");
const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

let testUser;
describe('user router', function() {

	before(function() {
		return runServer(DATABASE_URL);
	});
	after(function() {
		return closeServer();
	});

	it('should sign up new user on POST', function() {
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
	})
})
