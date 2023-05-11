const ProductController = require("../controllers/ProductController")
const { isLoggedIn } = require("../middleware/auth")

const router = require('express').Router()

router
  .get('/', ProductController.products)
  .get('/add', isLoggedIn, ProductController.formAdd)
  .post('/add', isLoggedIn, ProductController.create)
  .get('/myProducts', isLoggedIn, ProductController.myProducts)
  .get('/myProducts/:id', isLoggedIn, ProductController.myProductsEditForm)
  .post('/myProducts/:id', isLoggedIn, ProductController.myProductsEdit)
  .get('/myProducts/delete/:id', isLoggedIn, ProductController.myProductsDelete)
  .get('/:id', ProductController.detail)
  .get('/buy/:id', ProductController.buy)


module.exports = router