const ProductController = require("../controllers/ProductController")
const { isLoggedIn } = require("../middleware/auth")

const router = require('express').Router()

router
  .get('/', ProductController.products)
  .get('/add', isLoggedIn, ProductController.formAdd)
  .post('/add', isLoggedIn, ProductController.create)
  .get('/:id', ProductController.detail)
  .get('/buy/:id', ProductController.buy)

module.exports = router