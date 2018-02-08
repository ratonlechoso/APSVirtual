'use strict'
var mysql = require('mysql');

module.exports = {
    pool: mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        database: 'aps',
        user: 'admindb',
        password: 'apsvirtualdb',
        port: '3306',
        debug: false
    }),
    
    /**
    * Convenience wrapper for database connection in a transaction
    */
    inTransaction: function (pool, body, callback) {
        this.withConnection(pool, function (db, done) {

            db.beginTransaction(function (err) {
                if (err) return done(err);

                body(db, finished)
            })

            // Commit or rollback transaction, then proxy callback
            function finished(err) {
                var context = this;
                var args = arguments;

                if (err) {
                    if (err == 'rollback') {
                        args[0] = err = null;
                    }
                    db.rollback(function () { done.apply(context, args) });
                } else {
                    db.commit(function (err) {
                        args[0] = err;
                        done.apply(context, args)
                    })
                }
            }
        }, callback)
    },

    /**
     * Convenience wrapper for database connection from pool
     */
    withConnection: function (pool, body, callback) {
        pool.getConnection(function (err, db) {
            if (err) return callback(err);

            body(db, finished);

            function finished() {
                db.release();
                callback.apply(this, arguments);
            }
        })
    }
}