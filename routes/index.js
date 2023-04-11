var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {title: 'ddecoo.co'});
});

router.get('/category/:cat_id', (req, res) =>{ 
  let id = req.params.cat_id;
  res.render('category', {cat_id:id});
});

module.exports = router;
