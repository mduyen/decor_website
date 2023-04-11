var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'decor_website'
});
db.connect(function(err){
    if (err) throw err;
    console.log('Connected database!');
});
module.exports = db;