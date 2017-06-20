'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it, chai, mockAdapter, server */

require('../common');

var Constants = require('../../constants');


it('gets all adapters', (done) => {
  rp(chai.request(server)
    .get(Constants.ADAPTERS_PATH)).then(res => {
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
    res.body[0].should.have.a.property('id');
    res.body[0].id.should.be.eql(mockAdapter().getId());
    res.body[0].should.have.a.property('ready');
    res.body[0].ready.should.be.eql(mockAdapter().isReady());
    done();
  });
});

it('gets specifically mockAdapter', (done) => {
  let mockAdapterId = mockAdapter().getId();

  rp(chai.request(server)
    .get(Constants.ADAPTERS_PATH + '/' + mockAdapterId)).then(res => {
    res.should.have.status(200);
    res.body.should.have.a.property('id');
    res.body.id.should.be.eql(mockAdapter().getId());
    res.body.should.have.a.property('ready');
    res.body.ready.should.be.eql(mockAdapter().isReady());

    done();
  });
});

