const { Product, Category, User, Profile, ProductCategory } = require('../models')
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const { Op } = require("sequelize");
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
        name: {
          [Op.iLike]: `%${search}%`
        }
      }
    }
    Product.findAll(options)
      .then(products => {
        res.render('products/', { products, isLoggedIn: req.session.userId })
      })
      .catch(err => res.send(err))
  }

  static formAdd(req, res) {
    let { errors } = req.query
    Category.findAll()
      .then(category => {
        res.render('products/add', { category, isLoggedIn: req.session.userId, errors })
      })
      .catch(err => res.send(err))

  }

  static create(req, res) {
    const { name, description, price, category1, category2 } = req.body
    let productId
    Product.create({ name, description, price, UserId: req.session.userId })
      .then(product => {
        productId = product.id
        return ProductCategory.create({ ProductId: productId, CategoryId: category1 })
      })
      .then(() => {
        return ProductCategory.create({ ProductId: productId, CategoryId: category2 })
      })
      .then(() => res.redirect('/products'))
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          err = err.errors.map(e => e.message)
          return res.redirect(`/products/add?errors=${err}`)
        }
        res.send(err)
      })
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
    // const { id } = req.params
    // const options = {
    //   include: [Category, User]
    // }

    let data = JSON.parse(fs.readFileSync('./data/invoice.json', 'utf-8'))
    easyinvoice.createInvoice(data, function (result) {

      fs.writeFileSync('invoice.pdf', result.pdf, 'base64')
      // res.send(data)
    });
    // Product.findByPk(id, options)
    //   .then(dataProduct => {
    //     product = dataProduct
    //     return User.findByPk(dataProduct.User.id, {
    //       include: Profile
    //     })
    //   })
    //   .then(user => {
    //     res.send({ product, profile: user.Profile })
    //   })
    //   .catch(err => res.send(err))
  }


  static myProducts(req, res) {
    const id = req.session.userId
    const { search } = req.query

    const options = {
      include: [Category, User],
      where: { UserId: id }
    }
    if (search) {
      options.where.name = {
        [Op.iLike]: `%${search}%`
      }
    }
    Product.findAll(options)
      .then(products => {
        // res.send(products)
        res.render('products/myProducts', { products, isLoggedIn: id })
      })
      .catch(err => res.send(err))
  }

  static myProductsEditForm(req, res) {
    const { id } = req.params
    let { errors } = req.query

    Product.findByPk(id)
      .then(product => {
        res.render('products/edit-product', { product, isLoggedIn: req.session.userId, errors })
      })
      .catch(err => res.send(err))
  }

  static myProductsEdit(req, res) {
    const { id } = req.params
    const { name, description, price } = req.body
    Product.update({ name, description, price, UserId: req.session.userId }, { where: { id } })
      .then(() => {
        res.redirect('/products/myProducts')
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          err = err.errors.map(e => e.message)
          return res.redirect(`/products/myProducts/${id}?errors=${err}`)
        }
        res.send(err)
      })
  }

  static myProductsDelete(req, res) {
    const { id } = req.params

    Product.destroy({ where: { id } })
      .then(() => {
        res.redirect('/products/myProducts')
      })
      .catch(err => res.send(err))
  }
}


module.exports = ProductController