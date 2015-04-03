function TesseractClient(socket) {
	this.socket = socket;
}

TesseractClient.prototype.fetch = function (sql, callback) {
	var message = {
		'sql': sql
	};
	this.socket.write(JSON.stringify(message));

	this.socket.on('data', function (result) {
		callback(JSON.parse(result));
	});
}

TesseractClient.prototype.close = function () {
	this.socket.destroy();
}

exports.connect = function (host, callback)
{
	if (null == host) {
		host = 'localhost';
	}
	var server = host.split(':');
	if (server.length == 1) {
		server.push(3679);
	}

	var socket = require('net').Socket();
	socket.connect(server[1], server[0], function () {
		callback(null, new TesseractClient(socket));
	});

	socket.on('error', function () {
		callback('Could not connect to host: ' + host);
	});
}
