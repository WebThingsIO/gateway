var awsIot = require('aws-iot-device-sdk');

// Constantise/config these...
var device = awsIot.device({
   keyPath: `${__dirname}/certs/49bee6b671-private.pem.key`,
  certPath: `${__dirname}/certs/49bee6b671-certificate.pem.crt`,
    caPath: `${__dirname}/certs/ca.crt`,
  clientId: 'be-safe-gateway:e4d962b9-d521-4855-b5d1-284eb7a91361',
      host: 'a37v3cqodkv1fz.iot.eu-central-1.amazonaws.com'
});

device
  .on('connect', function() {
    device.subscribe('be-safe-gateway-events');
    device.publish('be-safe-gateway-events', JSON.stringify({ connection: new Date().toISOString() }));
  });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });

module.exports.eventBus = device;
