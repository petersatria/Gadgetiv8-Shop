const { Product, Category, User, Profile } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {
  static registerForm(req, res) {
    let { errors } = req.query

    res.render('auth/register', { errors, isLoggedIn: req.session.userId, })
  }

  static register(req, res) {
    const { username, email, password } = req.body

    User.create({ username, email, password, role: 'user' })
      .then(user => {
        return Profile.create({
          firstName: '',
          lastName: '',
          address: '',
          UserId: user.id
        })
      })
      .then(() => {
        res.redirect('/login')
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          err = err.errors.map(e => e.message)
          return res.redirect(`/register?errors=${err}`)
        }
        res.send(err)
      })
  }

  static loginForm(req, res) {
    let { errors } = req.query

    res.render('auth/login', { errors, isLoggedIn: req.session.userId, })
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

  static profilePage(req, res) {
    const userId = req.session.userId;
    if (!userId) {
      res.redirect("/login")
    }
    else {
      Profile.findOne({
        where: { UserId: userId },
        include: [User]
      })
        .then((userprofile) => {
          res.render('users/profile', { isLoggedIn: userId, userprofile });
        })
        .catch((err) => {
          res.send(err)
        })
    }
  }

  static editProfilePost(req, res) {
    const { firstname, lastname, address } = req.body
    const userId = req.session.userId;
    Profile.update({
      firstName: firstname,
      lastName: lastname,
      address: address,
    },
      { where: { UserId: userId } }
    )
      .then(() => {
        res.redirect("/users/profile");
      })
      .catch((err) => {
        res.send(err)
      })
  }

  static editProfileCredentialPost(req, res) {
    console.log(req.body)
    const { username, email, password } = req.body
    const userId = req.session.userId;

    User.update({
      username: username,
      email: email,
      password: password,
    }, {
      where: { id: userId },
      individualHooks: true
    }
    )
      .then(() => {
        res.redirect("/users/profile");
      })
      .catch((err) => {
        res.send(err)
      })
  }

}


module.exports = UserController