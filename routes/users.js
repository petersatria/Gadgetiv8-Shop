const UserController = require("../controllers/UserController")
const { isLoggedIn } = require("../middleware/auth")

const router = require('express').Router()

router
  .get('/register', UserController.registerForm)
  .post('/register', UserController.register)
  .get('/login', UserController.loginForm)
  .post('/login', UserController.login)
  .get('/logout', UserController.logout)
  .get('/users/profile', isLoggedIn, UserController.profilePage)
  .post('/users/profile', isLoggedIn, UserController.editProfilePost)
  .post('/users/profile/editcredentials', isLoggedIn, UserController.editProfileCredentialPost)



module.exports = router