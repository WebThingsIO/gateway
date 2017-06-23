/**
 * Module to group together our chai use and plugins.
 */
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

module.exports = chai;
