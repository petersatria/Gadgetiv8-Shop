const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(require('./routes'))

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
