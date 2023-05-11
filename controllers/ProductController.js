const { Product, Category } = require('../models')

class ProductController {
  static products(req, res) {
    Product.findAll({
      include: Category
    })
      .then(products => res.send(products))
      .catch(err => res.send(err))
  }
}


module.exports = ProductController