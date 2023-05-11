const ProductController = require("../controllers/ProductController")
const auth = require("../middleware/auth")

const router = require('express').Router()

router
  .get('/', ProductController.products)
  .get('/add', auth, ProductController.formAdd)
  .post('/add', auth, ProductController.create)
  .get('/:id', ProductController.detail)
  .get('/buy/:id', ProductController.buy)

module.exports = router