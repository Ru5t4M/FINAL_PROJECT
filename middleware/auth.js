function ensureAuthenticated(req, res, next) {
    if (req.cookies.token) {
      return next();
    }
    res.redirect('/users/login');
  }
  
  module.exports = { ensureAuthenticated };
  
