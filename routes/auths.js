var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const session = require('express-session');


router.get('/login', function(req, res, next) {
  res.render('auths/login', { title: 'Express', users: [
    { name: 'John', email: ''},
    { name: 'Paul', email: ''},
    { name: 'George', email: ''},
    { name: 'Ringo', email: ''}
  ] });
});

router.post('/login', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', { errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { errors: [{msg:'Invalid email or password'}] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { errors: [{msg:'Invalid email or password'}] });
    }

    console.log(user._id); // For debugging
    console.log(req.session); // Before setting req.session.userId

    
      
    // If credentials are correct, proceed with login
    req.session.userId = user._id; // Assuming you're using express-session
    res.redirect('/dashboard'); // Redirect to a protected route or dashboard
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
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
      console.error(errors.array()); // For debugging
      return res.status(400).render('auths/register', {
        title: 'Register',
        errors: errors.array()
      });
    }

    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.error('Email is already registered'); // For debugging
        return res.status(400).render('auths/register', {
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
      console.info('User registered successfully'); // For debugging
      res.redirect('/auths/login');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
