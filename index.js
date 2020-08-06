var express = require('express');
var app = express();
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var mongoDB = 'mongodb+srv://admin:admin@cluster0.zxhfs.mongodb.net/test';

var db = require('mongoose');
var Schema = db.Schema;
var ObjectId = Schema.ObjectId;
db.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log('ket noi mongoDB Thanh cong');
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());
app.use(express.static('images'));
var expressHandlebars = require('express-handlebars');
app.engine('.hbs', expressHandlebars({
    extname: 'hbs',
    defaultLayout: false,
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
}));
var storage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, './images/uploads');
    },
    filename(req, file, callback) {
        var d = new Date();
        var n = d.getTime();
        callback(null, req.body.namesp + n + path.extname(file.originalname));
    }
});

var SanPham = 'SanPham';
var SP = new Schema({
    NAMESP: String,
    GIA: Number,
    GIASALE: Number,
    SLSP: Number,
    AVATAR: String,
});

var upload = multer({storage: storage, limits: {fileSize: 1 * 1024 * 1024}});
var upload = upload.single('avatar');
app.post('/upload', upload, function (req, res) {
    var nameSP = req.body.namesp;
    var gia = req.body.gia;
    var slSP = req.body.sl;
    var giaSale = req.body.giasale;
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.send('kính thước file lớn quá 1MB');
        } else {
            var img = req.file.filename;
            var them = db.model(SanPham, SP);
            var kq = them({

                NAMESP: nameSP,
                GIA: gia,
                GIASALE: giaSale,
                SLSP: slSP,
                AVATAR: img,
            }).save(function (error) {
                if (error == null) {

                    res.send('luu thanh cong');
                } else {
                    res.send('khong thanh cong');
                }
            });
        }
    });
});


app.set('view engine', '.hbs');
app.get('/login', function (req, res) {
    res.render('SignUp');
});


app.get('/them', (req, res) => {
    res.render('index');


});
app.get('/sua', (req, res) => {
    var id_sv = '5f27608d3bdeed2cf088b237';
    var sua = db.model(SanPham, SP);
    var kq = sua.updateOne({_id: id_sv}, {
        name: 'Vu Van Tu',
        number: '3249324822',
    }, function (error) {
        res.send('sua thanh cong,kiem tra lai DB')
    })
});
app.get('/xoa', (req, res) => {
    var xoa = db.model(SanPham, SP);
    xoa.find({}).then(function (records) {

        records.forEach(function (record) {
            var id_sp = record._doc._id;
            console.log(record._doc._id);
            var kq = xoa.deleteOne({_id: id_sp},
                function (error) {
                    res.send('xoa thanh cong, kiem tra lại DB')
                }
            )
        });

    });


});
app.get('/danhsach', (req, res) => {
    var danhsach = db.model(SanPham, SP);
    var kq = danhsach.find({}, function (error, data) {
        res.render('listLogin', {dulieu: data})
    }).lean();
});
app.listen(process.env.PORT || ' 2000');