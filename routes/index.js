const router = require('express').Router()

router
  .get('/', (req, res) => {
    res.send('home')
  })
  .use('/users', require('./users'))
  .use('/products', require('./products'))

module.exports = router