/**
 * The TesseractClient is created when we sucessfully connect to the server.
 * @param {net.Socket} socket Client socket.
 */
function TesseractClient(socket) {
    this.socket = socket;

    // The tesseract server is a blocking server so we have to make sure all
    // jobs are added to a queue and handled one at a time. This will be fixed
    // in the future - until then this is an acceptable solution.
    this.queue = [];

    // When the server responds it will respond in JSON (for success or error).
    // We simply decode it and throw it back to the callback.
    var _this = this;
    this.socket.on('data', function (result) {
        // The current job is always the first element.
        var job = _this.queue[0];
        job.callback(JSON.parse(result));

        // Remove the current job from the queue.
        _this.queue.shift();

        // Trigger the next job to run.
        _this._next_job();
    });
};

/**
 * Internal method to add a job to the queue.
 * @param  {string}   message  Data to be sent to the server.
 * @param  {Function} callback Callback to execute with the result from the
 * server.
 */
TesseractClient.prototype._append_job = function (message, callback) {
    this.queue.push({
        'message': message,
        'callback': callback
    });

    // Only start the job queue if there is one job in the queue. Otherwise each
    // job would trigger it to be executed immediately and there would be no
    // reason for a queue...
    if (this.queue.length == 1) {
        this._next_job();
    }
};

/**
 * Fetch the result of a SQL statement.
 * @param  {string}   sql      The SQL statement to run.
 * @param  {Function} callback Callback to send the result from the server.
 * @return {[type]}            [description]
 */
TesseractClient.prototype.fetch = function (sql, callback) {
    // The SQL has to be packaged up in an object and sent as JSON to the
    // server.
    var message = {
        'sql': sql
    };

    // Add to the queue.
    this._append_job(JSON.stringify(message), callback);
};

/**
 * Close (destroy) the client connection. It's always polite to close the
 * connection when your finished with it, although there is no requirement to do
 * so.
 */
TesseractClient.prototype.close = function () {
    this.socket.destroy();
};

/**
 * Insert a new record. This is actually just a shorthand for writing the full
 * SQL.
 * @param  {string}   tableName The table name to insert the record into.
 * @param  {object}   object    The record.
 * @param  {Function} callback  Executed on completion.
 */
TesseractClient.prototype.insert = function (tableName, object, callback) {
    var sql = 'INSERT INTO ' + tableName + ' ' + JSON.stringify(object);
    this.fetch(sql, callback);
};

/**
 * Create a notification and listen for messages.
 * @param  {string}   tableName The table name to listen for changes.
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
TesseractClient.prototype.listen = function (tableName, callback) {
    var notificationName = 'foo'; //Math.random().toString(36).substring(7);
    var sql = 'CREATE NOTIFICATION ' + notificationName + ' ON ' + tableName;

    _this = this;
    this.fetch(sql, function (result) {
        // Do nothing.
    });

    // Now setup the listener on Redis.
    var redis = require('redis');
    var client = redis.createClient();

    client.on("message", function (channel, message) {
        callback(JSON.parse(message));
        client.unsubscribe();
        client.quit();
    });

    client.subscribe(notificationName);
};

/**
 * Internal method to run the next job on the queue.
 */
TesseractClient.prototype._next_job = function () {
    // If there is nothing in the queue, we just stop here.
    if (this.queue.length == 0) {
        return;
    }

    // Send the message to the server.
    var message = this.queue[0].message;
    this.socket.write(message);
};

/**
 * Internal method to add a job to the queue.
 * @param  {string}   message  Data to be sent to the server.
 * @param  {Function} callback Callback to execute with the result from the
 * server.
 */
TesseractClient.prototype._append_job = function (message, callback) {
    this.queue.push({
        'message': message,
        'callback': callback
    });

    // Only start the job queue if there is one job in the queue. Otherwise each
    // job would trigger it to be executed immediately and there would be no
    // reason for a queue...
    if (this.queue.length == 1) {
        this._next_job();
    }
};

/**
 * Internal method to run the next job on the queue.
 */
TesseractClient.prototype._next_job = function () {
    // If there is nothing in the queue, we just stop here.
    if (this.queue.length == 0) {
        return;
    }

    // Send the message to the server.
    var message = this.queue[0].message;
    this.socket.write(message);
};

module.exports = TesseractClient;
