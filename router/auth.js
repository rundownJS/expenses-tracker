const express = require("express")
const router = express.Router()

const { loginUser, registerUser, verifyJWT } = require("../controller/auth")

router.post("/login", loginUser)
router.post("/register", registerUser)
router.get("/verifyJWT", verifyJWT)

module.exports = router