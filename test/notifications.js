var tesseract = require('../src/Tesseract.js');

// Tests for listening to notifications.

function connectAndRun(test, body) {
    test.expect(2);

    tesseract.connect(null, function (err, client) {
        test.equals(err, null);
        body(client);
    });
}

var insertInterval;

function fireInserts(client) {
    insertInterval = setInterval(function () {
        client.insert('people', {
            'name': 'Joe Bloggs'
        });
    }, 100);
}

exports.testListenToAll = function(test) {
    connectAndRun(test, function(client) {
        var listener = client.listen('people')
            .then(function (data) {
                clearInterval(insertInterval);

                listener.stop();
                test.equals(JSON.stringify(data), '{"name":"Joe Bloggs"}');
                test.done();

                client.close();
            });

        fireInserts(client);
    });
};

exports.testListenWithFilterThatMatches = function(test) {
    connectAndRun(test, function(client) {
        var listener = client.listen('people')
            .where('name like "Joe %"')
            .then(function (data) {
                clearInterval(insertInterval);

                listener.stop();
                test.equals(JSON.stringify(data), '{"name":"Joe Bloggs"}');
                test.done();

                client.close();
            });

        fireInserts(client);
    });
};

exports.testListenWithFilterThatDoesNotMatch = function (test) {
    connectAndRun(test, function(client) {
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

        fireInserts(client);

        // With all the notifications firing 10 times a second, we shouldn't 
        // hear anything for a whole second.
        setTimeout(function() {
            clearInterval(insertInterval);

            listener.stop();
            test.ok(true);
            testDone();
        }, 1000);
    });
};
