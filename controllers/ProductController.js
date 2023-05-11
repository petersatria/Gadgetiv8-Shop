const { Product, Category, User, Profile } = require('../models')

class ProductController {
  static home(req, res) {
    res.redirect('/products')
  }
  static products(req, res) {
    const { search } = req.query
    const options = {
      include: [Category, User]
    }
    if (search) {
      options.where = {
        name: search
      }
    }
    Product.findAll(options)
      .then(products => {
        // res.send(products)
        res.render('products/', { products, isLoggedIn: req.session.userId })
      })
      .catch(err => res.send(err))
  }

  static formAdd(req, res) {
    res.render('products/add', { isLoggedIn: req.session.userId })
  }

  static create(req, res) {
    const { name, description, price } = req.body
    Product.create({ name, description, price, UserId: req.session.userId })
      .then(() => {
        res.redirect('/products')
      })
      .catch(err => res.send(err))
  }

  static detail(req, res) {
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
        res.render('products/product', { product, profile: user.Profile, isLoggedIn: req.session.userId })
      })
      .catch(err => res.send(err))
  }

  static buy(req, res) {
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