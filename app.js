const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))
app.use(require('./routes'))

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
