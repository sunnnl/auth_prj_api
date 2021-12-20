const { createUser, login, getUserByToken, refresh, getUsers, switchType } = require("./user_controller");
const router = require("express").Router();
const { checkToken } = require("../../config/jwt");

router.post("/", createUser)
router.post("/login", login)
router.get("/", checkToken, getUserByToken)
router.get("/refresh", checkToken, refresh)
router.get("/admin/users", getUsers)
router.post("/admin/switchType", switchType)

module.exports = router