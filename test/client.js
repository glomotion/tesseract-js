var tesseract = require('../src/Tesseract.js');

// Here are the general tests for the client.

exports.testConnect = function (test) {
    tesseract.connect(null, function (err, client) {
        test.equals(err, null);
        test.done();

        client.close();
    });
};

exports.testSimpleQuery = function (test) {
    tesseract.connect(null, function (err, client) {
        test.equals(err, null);

        client.fetch('SELECT 1 + 2', function (result) {
            test.ok(result.success);
            test.equals(result.data[0].col1, 3);
            test.done();

            client.close();
        });
    });
};

exports.testQueryError = function (test) {
    tesseract.connect(null, function (err, client) {
        test.equals(err, null);

        client.fetch('SELECT "abc" + 1', function (result) {
            test.equals(result.success, false);
            test.equals(result.error, 'No such operator string + number.');
            test.done();

            client.close();
        });
    });
};

exports.testDefaultPort = function (test) {
    test.equals(tesseract.defaultPort, 3679);
    test.done();
};
