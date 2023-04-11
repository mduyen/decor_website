var express = require('express');
var router = express.Router();
var db = require('../models/database');

/* GET home page. */
router.get('/newproducts', function(req, res, next) {
  db.query('select * from product order by date_add desc limit 0, 8', 
  (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

router.get('/viewproducts', function(req, res, next) {
  db.query('select * from product order by views desc limit 0, 6', 
  (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

router.get('/hotproducts', function(req, res, next) {
  db.query('select * from product where hot = 1 order by date_add desc limit 0, 6', 
  (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// router.get('/:id', function(req, res, next) {
//   let id = req.params.id;
//   db.query(`select * from product where pro_id=${id}`, 
//   (err, data) => {
//     if (err) throw err;
//     res.json(data);
//   });
// });

router.get('/category/:cat_id', (req, res) => {
  let id = req.params.cat_id;
  db.query(`select * from product where cat_id_fk=${id}`, 
  (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

module.exports = router; 