var tesseract = require('../src/Tesseract.js');

// Testing different ways a connection to the server can fail.

exports.testConnectingWithBadHost = function (test) {
    test.expect(1);

    tesseract.connect('nowhere', function (err) {
        test.equals(err, 'Could not connect to host: nowhere', err);
        test.done();
    });
};

exports.testConnectingWithBadPort = function (test) {
    test.expect(1);
    
    tesseract.connect('localhost:12345', function (err) {
        test.equals(err, 'Could not connect to host: localhost:12345', err);
        test.done();
    });
};
