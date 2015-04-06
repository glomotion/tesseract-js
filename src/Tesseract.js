var TesseractClient = require('./TesseractClient.js');

// Unless we are told otherwise there default port the server runs on is...
exports.defaultPort = 3679;

// Try to connect to the server. If the connection is successful then a
// TesseractClient will be passed back - otherwise you will receive the error.
exports.connect = function (host, callback) {
	// A `null` host means we want to connect to `localhost`.
	if (null == host) {
		host = 'localhost';
	}

	// Likewise we need to make sure we have the correct port number.
	var server = host.split(':');
	if (server.length == 1) {
		server.push(exports.defaultPort);
	}

	// Create the client socket and connect to the server.
	var socket = require('net').Socket();
	socket.connect(server[1], server[0], function () {
		callback(null, new TesseractClient(socket));
	});

	// Handle connection errors.
	socket.on('error', function () {
		callback('Could not connect to host: ' + host);
	});
}
