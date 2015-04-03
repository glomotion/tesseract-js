exports.connect = function (host, callback) {
	if (null == host) {
		return callback(null);
	}
	callback('Could not connect to host: ' + host);
}
