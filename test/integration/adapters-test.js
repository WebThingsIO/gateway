'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter, rp} = require('../common');

var Constants = require('../../constants');



it('gets all adapters', async () => {
  const res = await chai.request(server)
    .get(Constants.ADAPTERS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(1);
  res.body[0].should.have.a.property('id');
  res.body[0].id.should.be.eql(mockAdapter().getId());
  res.body[0].should.have.a.property('ready');
  res.body[0].ready.should.be.eql(mockAdapter().isReady());
});

it('gets specifically mockAdapter', async () => {
  let mockAdapterId = mockAdapter().getId();

  const res = await chai.request(server)
    .get(Constants.ADAPTERS_PATH + '/' + mockAdapterId);
  res.should.have.status(200);
  res.body.should.have.a.property('id');
  res.body.id.should.be.eql(mockAdapter().getId());
  res.body.should.have.a.property('ready');
  res.body.ready.should.be.eql(mockAdapter().isReady());
});

it('fails to get a nonexistent adapter', async () => {
  let mockAdapterId = 'nonexistent-adapter';

  try {
    await chai.request(server)
      .get(Constants.ADAPTERS_PATH + '/' + mockAdapterId);
  } catch(err) {
    err.response.should.have.status(404);
  }
});

