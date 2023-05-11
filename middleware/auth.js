const isLoggedIn = ((req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login?errors=login first')
  } else {
    next()
  }
})

module.exports = { isLoggedIn }