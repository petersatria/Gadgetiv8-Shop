const router = require('express').Router()

router
  .use(require('./users'))
  .use('/products', require('./products'))

module.exports = router