const { create, getUserByID, setRfToken, getUsers, changeType } = require("./user_service")
const { genSaltSync, hashSync, compareSync } = require("bcrypt")
const { sign } = require("jsonwebtoken");


module.exports = {
    createUser: (req, res) => {
        const body = req.body
        const salt = genSaltSync(10)
        console.log(req.body)
        body.password = hashSync(body.password, salt)
        create(body, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "DB connect error"
                })
            }
            // return res.status(200).json({
            //     success: 1,
            //     data: results
            // })
            return res.status(200).send("success")
        })
    },

    login: (req, res) => {
        const body = req.body;
        console.log(body)
        getUserByID(body.id, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Invalid ID or Password1"
                });
            }
            const result = compareSync(body.password, results.password);
            console.log(result)
            if (result) {
                // results.refresh_token = undefined;
                const jsontoken = sign({ result: results }, "[Token]", {
                    expiresIn: "10m"
                });
                const refreshToken = sign({ result: results.id }, "[Token]", {
                    expiresIn: "1h"
                });
                setRfToken({
                    refresh_token: refreshToken,
                    id: results.id
                }, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            success: 0,
                            message: "Invalid ID or Password2"
                        });
                    }
                })
                // return res.json({
                //     success: 1,
                //     message: "login successfully",
                //     token: jsontoken,
                //     refreshToken : refreshToken
                // });
                return res.header({
                    access_token: jsontoken,
                    refresh_token: refreshToken
                }).send();
            } else {
                return res.json({
                    success: 0,
                    message: "Invalid ID or Password2"
                });
            }
        });
    },

    getUserByToken: (req, res) => {
        // 토큰으로 사용자 정보 조회 ..
        const idByToken = req.decoded.result.id
        console.log(idByToken)
        getUserByID(idByToken, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Invalid ID or Password1"
                });
            }
            console.log(results)
            return res.json({
                id: results.id,
                nickname: results.nickname,
                type: results.type
            })
        });
    },

    refresh: (req, res) => {
        // refresh token이 validate하다면 새로운 access_token 발급
        const id = req.decoded.result
        getUserByID(id, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Invalid Token"
                });
            }
            const jsontoken = sign({ result: results }, "[Token]", {
                expiresIn: "10m"
            });
            return res.header({
                access_token: jsontoken
            }).send();
        })
    },

    getUsers: (req, res) => {
        getUsers((err, results) => {
            console.log(results)
            if (err) {
                console.log(err);
                return;
            }
            return res.send(results);
        })
    },

    switchType: (req, res) => {
        const body = req.body
        changeType(body.id, body.type, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.send(results);
        })
    }
}