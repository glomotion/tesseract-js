var tesseract = require('../tesseract.js');

module.exports = {
    testConnect: function (test) {
        tesseract.connect(null, function (err, client) {
            test.equals(err, null);
            test.done();

            client.close();
        });
    },

    testConnectBadHost: function (test) {
        tesseract.connect('nowhere', function (err) {
            test.equals(err, 'Could not connect to host: nowhere', err);
            test.done();
        });
    },

    testConnectBadPort: function (test) {
        tesseract.connect('localhost:1234', function (err) {
            test.equals(err, 'Could not connect to host: localhost:1234', err);
            test.done();
        });
    },

    testSimpleQuery: function (test) {
        tesseract.connect(null, function (err, client) {
            test.equals(err, null);

            client.fetch('SELECT 1 + 2', function (result) {
            	test.ok(result.success);
                test.equals(result.data[0].col1, 3);
                test.done();

                client.close();
            });
        });
    },

    testQueryError: function (test) {
        tesseract.connect(null, function (err, client) {
            test.equals(err, null);

            client.fetch('SELECT "abc" + 1', function (result) {
            	test.equals(result.success, false);
            	test.equals(result.error, 'No such operator string + number.');
                test.done();

                client.close();
            });
        });
    }
};
