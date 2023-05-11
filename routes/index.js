const router = require('express').Router()

router
  .get('/', (req, res) => {
    res.send('home')
  })
  .use(require('./users'))
  .use('/products', require('./products'))

module.exports = router