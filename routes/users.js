var express = require('express');
var router = express.Router();
var db = require('../models/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// SIGN UP
router.get('/signup', (req, res)=>{
  res.render('./admin/signup');
});

router.post('/save', function(req, res){
  let u = req.body.username;
  let f = req.body.user_fullname;
  let p = req.body.user_password;
  let e = req.body.user_email;
  let ph = req. body.user_phone;
  let a = req.body.user_address;

  //ma hoa pass
  const bcrypt = require('bcrypt');
  var salt = bcrypt.genSaltSync(10); // hàm genSaltSync() tạo chuỗi salt độ dài 10 ký tự 
  var pass_encryption = bcrypt.hashSync(p, salt); // hàm hashSync() mã hóa mật khẩu lưu trong biến p bằng cách dùng salt đã đc tạo ra

  let user_infor = {username: u, user_fullname:f, user_password: pass_encryption, user_email: e, user_phone: ph, user_address: a};
  let sql = 'insert into user set ?';
  db.query(sql, user_infor);
  res.redirect('/users/camon');
})

// LOGIN
router.get('/login', (req, res)=>{
  res.render('./admin/login');
})

router.post('/login_', async (req, res)=>{
  let u = req.body.username;
  let p = req.body.user_password;

  let sql = 'select * from user where username = ?';
  db.query(sql, [u], (err, rows) => {
    if (rows.length<=0) { // nếu mảng rows rỗng (k có tk nào trùng vs tên đn dc cc)
      res.render('/users/login');
      return;
    }
    let user = rows[0]; // lưu infor ng dùng đầu tiên trong mảng rows vào biến user
    let pass_fromdb = user.user_password; // lấy mk dc lưu db từ user lưu vào biến mới
    const bcrypt = require('bcrypt');
    var kq = bcrypt.compareSync(p, pass_fromdb);
    if (kq) {
      console.log('oki');

      var sess = req.session;
      sess.successfullogin = true;
      sess.username = user.username;

      // nếu thấy địa chỉ trang cũ thì trở lại trang cũ
      if (sess.back) {
        console.log(sess.back);
        res.redirect(sess.back);
      }
      else {
        res.redirect('/users/successfully');
      }

    }
    else {
      console.log('not oki');
      res.redirect('/users/login');
    }
  })
})

//

router.get('/changepassword', function (req, res) {
  if (req.session.successfullogin) {
      res.render("./admin/changepassword.ejs", { un: req.session.username });
  }
  else {
      req.session.back = "/users/changepassword";
      res.redirect("/users/login");
  }
});


// thực hiện đổi mật khẩu
router.post("/changepassword", async function (req, res) {
  let u = req.session.username;
  let oldPass = req.body.oldP;
  let newPass = req.body.newP;
  let confirm = req.body.confirm;

  // Kiểm tra các trường dữ liệu nhập vào
  if (newPass !== confirm) {
      res.render("./admin/changepassword", { error: "Xác nhận mật khẩu không đúng!" });
      return;
  }

  let sql = 'SELECT * FROM user WHERE username = ?';
  db.query(sql, [u], async (err, rows) => {
      if (rows.length <= 0) {
          res.redirect("/users/login");
          return;
      }
      let user = rows[0];
      let pass_fromdb = user.user_password;
      const bcrypt = require("bcrypt");
      if (!bcrypt.compareSync(oldPass, pass_fromdb)) {
          res.render("./admin/changepassword", { error: "Mật khẩu cũ không đúng!" });
          return;
      }
      var salt = bcrypt.genSaltSync(10);
      var pass_mahoa = bcrypt.hashSync(newPass, salt);
      sql = 'UPDATE user SET user_password = ? WHERE username = ?';
      await db.query(sql, [pass_mahoa, u]);
      res.redirect("/users/thanhcong1");
  });
});
router.get('/thanhcong1', function(req, res){
  res.render("thanhcong1");
});


// router.get('/success', (req, res)=>{
//   res.render('success');
// })






router.get('/download', (req, res)=>{
  if (req.session.successfullogin) {
    res.render('download', {un: req.session.username}); //un: lưu tên user
  } else {
    // lưu trữ đường dẫn trang trước mà ng dùng đã truy cập
    req.session.back='/users/download';

    res.redirect('/users/login');
  }
})

router.get('/signout', (req, res)=>{
  req.session.destroy();
  res.redirect('/users/login');
})






module.exports = router;
