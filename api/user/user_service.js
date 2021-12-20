const pool = require("../../config/pool")

module.exports = {
    create: (data, callback) => {
        pool.query(
            `INSERT INTO user (id, nickname, password) VALUES(?, ?, ?);`,
            [data.id, data.nickname, data.password],
            (error, results, fields) => {
                if (error) {
                    return callback(error)
                }
                // todo : token 발급
                return callback(null, results)
            }
        )
    },

    getUserByID: (data, callBack) => {
        pool.query(
            `select * from user where id = ?`,
            [data],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },

    setRfToken: (data, callback) => {
        pool.query(
            `update user set refresh_token = ? where id = ?`,
            [data.refresh_token, data.id],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },

    // getAllUsers : (data, callback) => {
    //     pool.query(
    //         'select id, nickname, type from user',
    //         [],
    //         (error, results, fields) => {
    //             if(error) {
    //                 return callback(error);
    //             }
    //             console.log(results)
    //             return callback(null, results);
    //         }
    //     )
    // }

    getUsers: callBack => {
        pool.query(
            `select id, nickname, type from user`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    changeType: (id, type, callback) => {
        pool.query(
            `update user set type = ? where id = ?`,
            [type, id],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },
}