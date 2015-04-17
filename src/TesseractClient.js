// The TesseractClient is created when we sucessfully connect to the server. The
// established `socket` is passed in so we can communicate with the server from
// here on out.
function TesseractClient(socket) {
  this.socket = socket;
}

// Fetch the result of a SQL statement.
TesseractClient.prototype.fetch = function(sql, callback) {
  // The SQL has to be packaged up in an object and sent as JSON to the
  // server.
  var message = {
    'sql': sql
  };
  this.socket.write(JSON.stringify(message));

  // When the server responds it will respond in JSON (for success or error).
  // We simply decode it and throw it back to the callback.
  this.socket.on('data', function(result) {
    callback(JSON.parse(result));
  });
};

// Close (destroy) the client connection. It's always polite to close the
// connection when your finished with it, although there is no requirement to do
// so.
TesseractClient.prototype.close = function() {
  this.socket.destroy();
};

// Insert a new record. This is actually just a shorthand for writing the full
// SQL.
TesseractClient.prototype.insert = function(tableName, object, callback) {
  var sql = 'INSERT INTO ' + tableName + ' ' + JSON.stringify(object);
  this.fetch(sql, callback);
};

module.exports = TesseractClient;
