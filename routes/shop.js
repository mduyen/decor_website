var express = require('express');
var router = express.Router();
var db = require('../models/database');


router.get('/', (req, res) => {
    db.query('select * from product order by date_add desc limit 0, 8', 
    (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });
  


module.exports = router;