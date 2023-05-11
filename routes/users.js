const UserController = require("../controllers/UserController")

const router = require('express').Router()

router
  .get('/register', UserController.registerForm)
  .post('/register', UserController.register)
  .get('/login', UserController.loginForm)
  .post('/login', UserController.login)
  .get('/logout', UserController.logout)

module.exports = router