var tesseract = require('../src/Tesseract.js');

// Tests for listening to notifications.

exports.testListenToAll = function (test) {
    test.expect(2);

    tesseract.connect(null, function (err, client) {
        test.equals(err, null);

        client.listen('people')
            .then(function (data) {
                test.equals(JSON.stringify(data), '{"name":"Joe Bloggs"}');
                test.done();

                client.close();
            });

        // We need a slight timeout to give the subscription time to setup.
        setTimeout(function () {
            client.insert('people', {
                'name': 'Joe Bloggs'
            }, function (err) {
                // Do nothing.
            });
        }, 200);
    });
};

exports.testListenWithFilterThatMatches = function (test) {
    test.expect(2);

    tesseract.connect(null, function (err, client) {
        test.equals(err, null);

        client.listen('people')
            .where('name like "Joe%"')
            .then(function (data) {
                test.equals(JSON.stringify(data), '{"name":"Joe Bloggs"}');
                test.done();

                client.close();
            });

        // We need a slight timeout to give the subscription time to setup.
        setTimeout(function () {
            client.insert('people', {
                'name': 'Joe Bloggs'
            }, function (err) {
                // Do nothing.
            });
        }, 200);
    });
};
