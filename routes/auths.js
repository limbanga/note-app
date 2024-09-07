var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('auths/login', { title: 'Express', users: [
    { name: 'John', email: ''},
    { name: 'Paul', email: ''},
    { name: 'George', email: ''},
    { name: 'Ringo', email: ''}
    
  ] });
});

router.get('/register', function(req, res, next) {
  res.render('auths/register', { title: 'Express', users: [
    { name: 'John', email: ''},
    { name: 'Paul', email: ''},
    { name: 'George', email: ''},
    { name: 'Ringo', email: ''}
    
  ] });
});


router.post('/register',
  [
    body('name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  async (req, res) => {
    const { name, email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        errors: errors.array()
      });
    }

    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).render('auth/register', {
          title: 'Register',
          errors: [{ msg: 'Email is already registered' }]
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the new user to the database
      const user = new User({
        name,
        email,
        password: hashedPassword
      });
      await user.save();

      // Redirect to login page after successful registration
      res.redirect('/auth/login');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
