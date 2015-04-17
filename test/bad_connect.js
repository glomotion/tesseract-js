var tesseract = require('../src/Tesseract.js');

// Testing different ways a connection to the server can fail.

exports.testConnectingWithBadHost = function(test) {
  tesseract.connect('nowhere', function(err) {
    test.equals(err, 'Could not connect to host: nowhere', err);
    test.done();
  });
};

exports.testConnectingWithBadPort = function(test) {
  tesseract.connect('localhost:1234', function(err) {
    test.equals(err, 'Could not connect to host: localhost:1234', err);
    test.done();
  });
};
