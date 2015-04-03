exports.connect = function (host, callback) {
	if (null == host) {
		host = 'localhost';
	}
	var server = host.split(':');
	if (server.length == 1) {
		server[1] = 6379;
	}

	var s = require('net').Socket();
	s.connect(server[1], server[0]);
	//s.write('GET http://www.google.com/ HTTP/1.1\n\n');

	s.on('error', function () {
		callback('Could not connect to host: ' + host);
	});
	s.on('connect', function () {
		callback(null);
	});

	s.end();
}
