var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', users: [
    { name: 'John', email: ''},
    { name: 'Paul', email: ''},
    { name: 'George', email: ''},
    { name: 'Ringo', email: ''}
    
  ] });
});

module.exports = router;
