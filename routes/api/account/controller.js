const db = require('../../db');

module.exports = {
    insertAuth: function (data, onError, onSuccess) {
        db.connect();
        db.query('INSERT INTO public."auth" VALUES($1, $2)', data, function (err, data) {
            if (err) {
                onError(err);
            } else {
                onSuccess(data);
            }
        });
    },
    insertAuth: function (data, callback) {
        db.connect();
        db.query('INSERT INTO public."auth" VALUES($1, $2)', data, function (err, data) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, err)
            }
            db.close();
        });
    },
    insertStudent: function (data, callback) {
        db.connect();
        db.query('INSERT INTO public."student" VALUES ($1, $2, $3, $4)', data, function (err, data) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, data)
            }
            db.close()
        })
    },
    deleteAuth: function (id) {
        db.connect();
        db.query('DELETE FROM public."auth" WHERE "id" = $1', [id], function (err, data) {})
        
    },
    findAuth: function (id, callback) {
        db.connect();
        db.query('SELECT * FROM public.auth WHERE "id" = $1', [id], function (err, data) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, data.rows[0]);
            }
            db.close();
        })
    },
    getStudent: function (id, callback) {
        db.connect();
        db.query('SELECT * FROM public."student" WHERE "id" = $1', [id], function (err, user) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, user);
            }
            db.close();
        })
    },
    saveToken: function (id, token, callback) {
        db.connect();
        db.query('UPDATE public."auth" SET "token"=$2 WHERE "id"=$1', [id, token], function (err, data) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, err);
            }
        })
    },
    verifyToken: function (id, token, callback) {
        db.connect();
        db.query('SELECT id FROM public.auth WHERE "id"=$1 AND "token"=$2', [id, token], function (err, data) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, data);
            }
        })
    }
};