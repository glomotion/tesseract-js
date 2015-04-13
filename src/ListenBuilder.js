function ListenBuilder(client, tableName) {
    this.client = client;
    this.tableName = tableName;
};

ListenBuilder.prototype.where = function(whereSQL) {
    this.whereSQL = whereSQL;
    return this;
};

ListenBuilder.prototype.then = function(callback) {
    var notificationName = Math.random().toString(36).substring(7);
    var sql = 'CREATE NOTIFICATION ' + notificationName + ' ON ' + this.tableName;
    if (this.whereSQL) {
        sql += " WHERE " + this.whereSQL;
    }

    this.client.fetch(sql, function (result) {
        // Do nothing.
    });

    // Now setup the listener on Redis.
    var redis = require('redis');
    this.listener = redis.createClient();

    this.listener.on("message", function (channel, message) {
        callback(JSON.parse(message));
    });

    this.listener.subscribe(notificationName);

    return this;
};

ListenBuilder.prototype.stop = function() {
    this.listener.unsubscribe();
    this.listener.quit();
}

module.exports = ListenBuilder;
