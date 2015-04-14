var redis = require('redis');

/**
 * A ListenerBuilder creates a notification via chaining of the listen()
 * function on the client.
 * @param {TesseractClient} client The tesseract client.
 * @param {String} tableName The name of the table the notification will apply
 * to.
 */
function ListenBuilder(client, tableName) {
    this.client = client;
    this.tableName = tableName;

    // Lets generate a random name for the notification now. This isn't
    // important for outside this class so you will not need this value.
    this.notificationName = Math.random().toString(36).substring(7);
};

/**
 * Add an expression to the listener to specify which objects will send the
 * notification.
 * @param {String} whereSQL The SQL expression like "value BETWEEN 10 AND 100".
 * @return {ListenBuilder} This instance for chaining.
 */
ListenBuilder.prototype.where = function(whereSQL) {
    this.whereSQL = whereSQL;
    return this;
};

/**
 * This will create the notification based on the the chaining before hand.
 * @param {Function} callback(Object) The object will be the record in the
 * notification.
 * @return {ListenBuilder} Listener instance. You will need this to perform
 * actions afterwards like stopping further notifications.
 */
ListenBuilder.prototype.then = function(callback) {
    var sql = this._notificationSQL();
    this.client.fetch(sql);
    this._subscribeToRedis(callback);

    return this;
};

/**
 * Stop receiving notifications from this listener. It is important you close
 * this as it may cause your process to hang if you dont.
 */
ListenBuilder.prototype.stop = function() {
    this.listener.unsubscribe();
    this.listener.quit();
};

/**
 * Internal method to setup the subscriber on Redis.
 */
ListenBuilder.prototype._subscribeToRedis = function(callback) {
    this.listener = redis.createClient();

    this.listener.on("message", function (channel, message) {
        callback(JSON.parse(message));
    });

    this.listener.subscribe(this.notificationName);
};

/**
 * Internal method to generate the SQL that will create the notification.
 * @param {Function} callback [description]
 * @return {String}
 */
ListenBuilder.prototype._notificationSQL = function() {
    var sql = 'CREATE NOTIFICATION ' + this.notificationName + ' ON ' +
        this.tableName;

    if (this.whereSQL) {
        sql += " WHERE " + this.whereSQL;
    }

    return sql;
};

module.exports = ListenBuilder;
