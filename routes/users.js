const UserController = require("../controllers/UserController")

const router = require('express').Router()

router
  .get('/users/profile', UserController.profilePage)
  .get('/users/profile/edit/:id', UserController.editProfile)
  .post('/users/profile/edit/:id', UserController.editProfilePost)
  .post('/users/profile/editcredentials/:id', UserController.editProfileCredentialPost)
  .get('/register', UserController.registerForm)
  .post('/register', UserController.register)
  .get('/login', UserController.loginForm)
  .post('/login', UserController.login)
  .get('/logout', UserController.logout)

module.exports = router