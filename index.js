var express = require('express');
var app = express();
var multer = require('multer');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());
var expressHandlebars = require('express-handlebars');
app.engine('.hbs', expressHandlebars({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views"
}));
var storage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename(req, file, callback) {
        var d = new Date();
        var n = d.getTime();
        callback(null, file.originalname + Math.random() + n);
    }
});
var upload = multer({storage: storage, limits: {fileSize: 1 * 1024 * 1024}});
var upload = upload.single('avatar');
app.post('/upload',upload, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var sdt = req.body.sdt;
    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            return res.send('kính thước file lớn quá 1MB');
        } else {
            // return res.send('tệp không xác định');

        }
        console.log(req.file);
        res.send('Use: ' + username + ' || Pass: ' + password + ' || SĐT:' + sdt + req.file.originalname);
    });

   // res.send('Use: ' + username + ' || Pass: ' + password + ' || SĐT:' + sdt + upload.req.file.originalname);

})


app.set('view engine', '.hbs');
app.get('/login', function (req, res) {
    res.render('SignUp');
});
app.get('/signUp', function (req, res) {
    res.render('index');

});
app.get('/list', function (req, res) {
    res.render('listLogin');

});

app.get('/Handlebars',function (req,res) {
res.render('lab4');
})
app.get('/baitho',function (req,res) {
    res.render('baitho');
})
app.listen(process.env.PORT || ' 2000');