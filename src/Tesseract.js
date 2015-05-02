// When running nodeunit any errors are suppressed silently. Seems a bit stupid
// but we have to put this in so that errors will display:
// http://stackoverflow.com/a/20038890/1470961
process.on('uncaughtException', function(err) {
    console.error(err.stack);
});

var TesseractClient = require('./TesseractClient.js');

/**
 * The default port number for the tesseract server.
 * @type {Number}
 */
exports.defaultPort = 3679;

/**
 * Try to connect to the server. If the connection is successful then a
 * TesseractClient will be passed back - otherwise you will receive the error.
 * @param  {String}   host     The host, which may also include the port number.
 * Some examples are 'localhost', '1.2.3.4:1234', 'mydomain.com'.
 * @param  {Function} callback(err, result)
 */
exports.connect = function (host, callback) {
    // A `null` host means we want to connect to `localhost`.
    if (null === host) {
        host = 'localhost';
    }

    // Likewise we need to make sure we have the correct port number.
    var server = host.split(':');
    if (server.length == 1) {
        server.push(exports.defaultPort);
    }

    // Create the client socket and connect to the server.
    var socket = require('net').Socket();
    socket.connect(server[1], server[0]);

    // Hopefully this happens.
    socket.on('connect', function () {
        callback(null, new TesseractClient(socket));
    });

    // Handle connection errors.
    socket.on('error', function () {
        callback('Could not connect to host: ' + host);
    });
};
