const { Product, Category, User, Profile } = require('../models')

class ProductController {
  static products(req, res) {
    if(!req.session.userId){
      res.redirect("/login")
    }
    Product.findAll({
      include: [Category, User]
    })
      .then(products => {
        // res.send(products)
        res.render('products/', { products })
      })
      .catch(err => res.send(err))
  }

  static formAdd(req, res) {
    if(!req.session.userId){
      res.redirect("/login")
    }
    res.render('products/add')
  }

  static create(req, res) {
    if(!req.session.userId){
      res.redirect("/login")
    }
    console.log(req.session, 'AADDDDDDDDDDD');

    const { name, description, price } = req.body
    Product.create({ name, description, price, UserId: req.session.userId })
      .then(() => {
        res.redirect('/products')
      })
      .catch(err => res.send(err))
  }

  static detail(req, res) {
    if(!req.session.userId){
      res.redirect("/login")
    }
    const { id } = req.params
    const options = {
      include: [Category, User]
    }
    let product
    Product.findByPk(id, options)
      .then(dataProduct => {
        product = dataProduct
        return User.findByPk(dataProduct.User.id, {
          include: Profile
        })
      })
      .then(user => {
        // res.send({ product, profile: user.Profile })
        res.render('products/product', { product, profile: user.Profile })
      })
      .catch(err => res.send(err))
  }

  static buy(req, res) {
    if(!req.session.userId){
      res.redirect("/login")
    }
    const { id } = req.params
    const options = {
      include: [Category, User]
    }

    let product
    Product.findByPk(id, options)
      .then(dataProduct => {
        product = dataProduct
        return User.findByPk(dataProduct.User.id, {
          include: Profile
        })
      })
      .then(user => {
        res.send({ product, profile: user.Profile })
        // res.render('products/product', { product, profile: user.Profile })
      })
      .catch(err => res.send(err))
  }
}


module.exports = ProductController