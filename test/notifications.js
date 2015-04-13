var tesseract = require('../src/Tesseract.js');

// Tests for listening to notifications.

exports.testListenToAll = function (test) {
    test.expect(2);

    tesseract.connect(null, function (err, client) {
        test.equals(err, null);

        var listener = client.listen('people')
            .then(function (data) {
                listener.stop();
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

        var listener = client.listen('people')
            .where('name like "Joe %"')
            .then(function (data) {
                listener.stop();
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

exports.testListenWithFilterThatDoesNotMatch = function (test) {
    test.expect(2);

    tesseract.connect(null, function (err, client) {
        test.equals(err, null);

        function testDone() {
            test.done();
            client.close();
        }

        var listener = client.listen('people')
            .where('name like "Bob %"')
            .then(function (data) {
                test.ok(false, "We didn't want to receive this notification.");
                testDone();
            });

        // We need a slight timeout to give the subscription time to setup.
        setTimeout(function () {
            client.insert('people', {
                'name': 'Joe Bloggs'
            }, function (err) {
                // Do nothing.
            });
        }, 200);

        // An even further timeout to make sure we didn't receive the
        // notification.
        setTimeout(function() {
            listener.stop();
            test.ok(true);
            testDone();
        }, 500);
    });
};
