'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter} = require('../common');

var Constants = require('../../constants');
const WebSocket = require('ws');

it('removes all existing actions', done => {

  chai.request(server)
    .get(Constants.ACTIONS_PATH).then(res => {
    res.should.have.status(200);
    res.body.should.be.a('array');

    // Issue a request to delete all current actions
    let deleteReqs = res.body.map(action => {
      return chai.request(server)
        .delete(Constants.ACTIONS_PATH + '/' + action.id);
    });

    return Promise.all(deleteReqs);
  }).then(responses => {
    for (let res of responses) {
      res.should.have.status(204);
    }

    return chai.request(server)
      .get(Constants.ACTIONS_PATH);
  }).then(res => {
    res.body.should.be.a('array');
    res.body.length.should.be.eql(0);

    done();
  });
});

it('GET with no actions', (done) => {
  chai.request(server)
    .get(Constants.ACTIONS_PATH)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
      done();
    });
});

it('should fail to create a new action (empty body)', (done) => {
  chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send()
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
});

it('should fail to create a new action (unknown name)', (done) => {
  let descr = {
    name: 'potato'
  };
  chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send(descr)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
});

it('should create a new pairing action', (done) => {
  let descr = {
    name: 'pair'
  };
  chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send(descr)
    .end((err, res) => {
      res.should.have.status(201);
      done();
    });
});

it('should list and retrieve the new action', (done) => {
  chai.request(server)
    .get(Constants.ACTIONS_PATH).then(res => {
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
    res.body[0].should.have.a.property('name');
    res.body[0].should.have.a.property('id');
    res.body[0].name.should.be.eql('pair');

    return res.body[0].id;
  }).then(actionId => {
    return chai.request(server)
      .get(Constants.ACTIONS_PATH + '/' + actionId);
  }).then(res => {
    res.should.have.status(200);
    res.body.should.have.a.property('name');
    res.body.name.should.be.eql('pair');
    res.body.should.have.a.property('id');

    done();
  });
});

it('should error retrieving a nonexistent action', (done) => {
  let actionId = 'tomato';
  chai.request(server)
    .get(Constants.ACTIONS_PATH + '/' + actionId).then(() => {
    throw new Error('Response should be 404');
  }).catch(err => {
    err.response.should.have.status(404);
    done();
  });
});

it('should remove an action', done => {

  chai.request(server)
    .get(Constants.ACTIONS_PATH).then(res => {
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
    let actionId = res.body[0].id;
    return actionId;
  }).then(actionId => {
    return chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + actionId);
  }).then(res => {
    res.should.have.status(204);

    return chai.request(server)
      .get(Constants.ACTIONS_PATH);
  }).then(res => {
    res.body.should.be.a('array');
    res.body.length.should.be.eql(0);

    done();
  });
});

it('should error removing a nonexistent action', done => {
  let actionId = 555;

  chai.request(server)
    .delete(Constants.ACTIONS_PATH + '/' + actionId).then(res => {
    throw new Error('Not a 404');
  }).catch(err => {
    err.response.status.should.be.eql(404);
    done();
  });
});

it('should error on an unpair of a nonexistent device',
   done => {
  let thingId = 'test-nonexistent';
  // The mock adapter requires knowing in advance that we're going to unpair
  // a specific device
  mockAdapter().unpairDevice(thingId);

  chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send({name: 'unpair', parameters: {id: thingId}}).then(res => {
    res.should.have.status(201);
    return chai.request(server)
      .get(Constants.ACTIONS_PATH);
  }).then(res => {
    res.body.should.be.a('array');
    res.body[0].should.have.a.property('name');
    res.body[0].name.should.be.eql('unpair');

    res.body[0].should.have.a.property('id');

    res.body[0].should.have.a.property('status');
    res.body[0].status.should.be.eql('error');

    res.body[0].should.have.a.property('error');
    done();
  });
});

