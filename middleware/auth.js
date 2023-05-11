const isLoggedIn = ((req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login?errors=Login first')
  } else {
    next()
  }
})

module.exports = { isLoggedIn }