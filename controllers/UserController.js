const { Product, Category, User, Profile } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {
  static homePage(req, res) {
    const userId = req.session.userId;
    if(!userId){
      res.redirect("/login")
    }
    else {
      Profile.findByPk(userId)
      .then((profile) => {
        res.render('users/home', { userId, profile });
      })
      .catch(err => {
        res.send(err)
      })
    }
  }

  static registerForm(req, res) {
    res.render('auth/register')
  }

  static register(req, res) {
    const { username, email, password, role } = req.body

    User.create({ username, email, password, role: 'user' })
      .then(() => {
        res.redirect('/login')
      })
      .catch(err => res.send(err))
  }

  static loginForm(req, res) {
    res.render('auth/login')
  }

  static login(req, res) {
    const { username, password } = req.body

    User.findOne({ where: { username } })
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password)
          if (isValidPassword) {
            req.session.userId = user.id
            console.log(req.session.userId)
            return res.redirect('/')
          } else {
            return res.redirect('/login?errors=invalid username/password') //error 
          }
        } else {
          return res.redirect('/login?errors=invalid username/password') //error 
        }
      })
      .catch(err => res.send(err))
  }

  static logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/login')
      }
    })
  }
}


module.exports = UserController