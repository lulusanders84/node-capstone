
"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const { DATABASE_URL } = require("../config");
const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('index', function() {

	before(function() {
		return runServer(DATABASE_URL);
	});
	after(function() {
		return closeServer();
	});

	it('should load', function() {
		return chai.request(app)
		.get("/")
		.then(function(res) {
			expect(res).to.have.status(200);
		})
	})

	it('should retrieve patients on GET', function() {
		return chai.request(app)
		.get('/api/patients')
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})
})
