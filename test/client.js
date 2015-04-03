module.exports = {
    setUp: function (callback) {
        this.tesseract = require('../tesseract.js');
        callback();
    },
    testConnect: function (test) {
		this.tesseract.connect(null, function (err) {
		    test.equals(err, null);
		    test.done();
		});
    },
    testConnectBadHost: function (test) {
		this.tesseract.connect('nowhere', function (err) {
		    test.equals(err, 'Could not connect to host: nowhere');
		    test.done();
		});
    },
    testConnectBadPort: function (test) {
		this.tesseract.connect('localhost:1234', function (err) {
		    test.equals(err, 'Could not connect to host: localhost:1234');
		    test.done();
		});
    },
};
