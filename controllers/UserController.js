const { Product, Category, User, Profile } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {
  static profilePage(req, res) {
    const userId = req.session.userId;
    if(!userId){
      res.redirect("/login")
    }
    else {
      Profile.findOne({
        where: { UserId: userId },
        include: [User]
      })
      .then((userprofile) =>{
        res.render('users/profile', { isLoggedIn:userId , userprofile });
      })
      .catch((err) => {
        res.send(err)
      })
    }
  }

  static editProfile(req, res) {
    const userId = req.session.userId;
    if(!userId){
      res.redirect("/login")
    }
    else {
      Profile.findOne({
        where: { UserId: userId },
        include: [User]
      })
      .then((userprofile) =>{
        res.render('users/editProfile', { isLoggedIn:userId , userprofile });
      })
      .catch((err) => {
        res.send(err)
      })
    }
  }

  static editProfilePost(req, res) {
    console.log(req.body)
    const {firstname, lastname, address} = req.body
    const userId = req.session.userId;
    Profile.update({ 
      firstName: firstname, 
      lastName: lastname, 
      address: address,
      },
      { where: { UserId: userId } }
      )
    .then(() =>{
      res.redirect("/users/profile");
    })
    .catch((err) => {
      res.send(err)
    })
  }

  static editProfileCredentialPost(req, res) {
    console.log(req.body)
    const {username, email, oldpassword, password} = req.body
    const userId = req.session.userId;
    // User.findOne({ where: { id: userId } })
    //   .then((user) => {
    //     const isValidPassword = bcrypt.compareSync(oldpassword, user.password)
    //     if (!isValidPassword) {
    //       return res.redirect(`/users/profile/edit/${userId}?errors=invalid password`)
    //     } 
    // })
    User.update({ 
      username: username, 
      email: email, 
      password: password,
      },
      { where: { id: userId } }
      )
    .then(() =>{
      res.redirect("/users/profile");
    })
    .catch((err) => {
      res.send(err)
    })
  }

  static registerForm(req, res) {
    res.render('auth/register')
  }

  static register(req, res) {
    const { username, email, password, role, firstname, lastname, address } = req.body

    User.create(
      { username, 
        email, 
        password, 
        role: 'user' 
      }, 
      { returning: ['id'] }
    )
      .then(user => {
        const id = user.id;
        Profile.create({
          firstName: firstname,
          lastName: lastname,
          address: address,
          UserId: id
        })
        .then(()=>{
          res.redirect('/login')
        })
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