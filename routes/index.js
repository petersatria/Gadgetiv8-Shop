const ProductController = require("../controllers/ProductController")

const router = require('express').Router()

router
  .get('/', ProductController.home)
  .use(require('./users'))
  .use('/products', require('./products'))

module.exports = router