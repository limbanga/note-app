const loggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auths/login"); // Redirect to login if not authenticated
  }
  next(); // Proceed if authenticated
};

module.exports = loggedIn;
