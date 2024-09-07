var express = require('express');
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

module.exports = router;
