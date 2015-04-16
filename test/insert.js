var tesseract = require('../src/Tesseract.js');

// Tests for inserting new data.

exports.testInsert = function(test) {
    test.expect(2);

    tesseract.connect(null, function(err, client) {
        test.equals(err, null);

        client.insert('people', {
            'name': 'Joe Bloggs'
        }, function (result) {
            test.ok(result.success);
            test.done();
            client.close();
        });
    });
};

exports.testInsertDoesNotNeedToHaveACallback = function(test) {
    test.expect(1);

    tesseract.connect(null, function(err, client) {
        test.equals(err, null);

        client.insert('people', {
            'name': 'Joe Bloggs'
        });

        test.done();
        client.close();
    });
};
