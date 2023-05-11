const { Product, Category, User, Profile } = require('../models')
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
    let data = JSON.parse(fs.readFileSync('./data/invoice.json', 'utf-8'))
    console.log(data);
    easyinvoice.createInvoice(data, function (result) {

      // return fs.writeFileSync('tes.pdf', result.pdf, 'base64')
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

    Product.findByPk(id)
      .then(product => {
        res.render('products/edit-product', { product, isLoggedIn: req.session.userId })
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
      .catch(err => res.send(err))
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