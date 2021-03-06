var express = require('express')
var bp = require('body-parser')
var app = express()
var fs = require('fs');
var formidable = require('formidable');
const fileUpload = require('express-fileupload');
const HummusRecipe = require('hummus-recipe');
var urlencodedParser = bp.urlencoded({ extended: false })
app.use(express.static("views"));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json({ extended: false }));
require('./EmployeeSchema')
var mongoose = require('mongoose')
var session = require('client-sessions')
var pdfparse = require('pdf-parse');
var s;

app.set('port', (process.env.PORT || 5000));


var count = 0;

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'));
mongoose.connect('mongodb+srv://keshav27:keshav27@cluster0-mtsng.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
var Employee = mongoose.model('EmployeeDB')
app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app.get('/', function (req, res) {
    res.redirect('/home');
});


app.post('/login_validation', function (req, res) {
    console.log(req.body);
    console.log(req.body.empid + "'   '" + req.body.empass);
    if (req.body.empid == '') {
        res.send({ status: 'Invalid' });
    } else {
        Employee.find({ empid: req.body.empid }, (err, docs) => {
            if (docs.length == 0) {
                res.send({ status: 'Invalid' });
            } else if (err) {
                console.log(err);
            } else {
                var pass = req.body.empass;
                var dpass = docs[0].password;
                if (pass == dpass) {
                    //console.log("EQUAL")
                    var emp = {
                        empid: req.body.empid
                    }
                    req.session.emp = emp;
                    res.send({ status: 'home' })
                } else {
                    // console.log("NOT EQUAL")
                    res.send({ status: 'Invalid' });
                }
            }
        })
    }
})
app.get('/register', function (req, res) {
    res.render('register.ejs');
})
app.post('/registration', function (req, res) {

    Employee.find({ empid: req.body.empid }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        if (Object.keys(docs).length != 0) {
            res.send({ status: 'Error' });
        } else {
            var emp = new Employee();
            emp.empid = req.body.empid;
            emp.name = req.body.name;
            emp.password = req.body.password;
            emp.email = req.body.email;
            emp.contactno = req.body.contactno;
            emp.save((err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted');
                }
            })
            res.send({ status: 'Registered' });
        }
    })
})
app.get('/regerror', function (req, res) {
    res.render('regerrpage.ejs');
})
app.get('/home', function (req, res) {
    res.render('home.ejs');
})

app.post('/home', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {

        var filename;
        var date = Date.now();
        var datestring = date.toString(10);
        filename = file.name;
        s = datestring.concat(filename);
        file.path = __dirname + '/uploads/' + s;
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + s);
    });

    res.sendFile(__dirname + '/edit.ejs');
    res.render('edit.ejs');
})

app.get('/sign', function (req, res) {
    res.sendFile('sign.html', { root: __dirname + '/views' });
})

app.get('/edit', function (req, res) {
    res.render('home.ejs');
})

app.post('/edit', function (req, res) {
    let tss = Date.now();
    let date_ob = new Date(tss);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    var str = "Signed on - " + hours + ":" + minutes + ":" + seconds + " - " + date + "-" + month + "-" + year;
    console.log(str);

    console.log(s);
    const pdfDoc = new HummusRecipe('uploads/' + s, 'Saved/' + s);
    const pdffile = fs.readFileSync('uploads/' + s);
    var page = req.body.page;
    var one = Number(req.body.first);
    var two = Number(req.body.last);

    console.log(page);
    if (page != 'all') {
        pdfparse(pdffile).then(function (data) {
            count = data.numpages;
            var pagenumber = count;
            if (page <= count && page > 0) {
                pagenumber = Number(page);
            }
            else {
                pagenumber = data.numpages;
            }
            pdfDoc
                .editPage(pagenumber)
                .text('Signature Here', one, two, { color: '#050505', fontSize: 9 })
                .rectangle(one, two + 10, 102, 59, { stroke: '#050505', lineWidth: 1 })
                .image('C:/Users/hp/Downloads/signature.jpg', one + 1, two + 11, { width: 100, keepAspectRatio: true })
                .text(str, one, two + 70, { color: '#050505', fontSize: 9 })
                .endPage()
                .endPDF();
            var filePath = 'C:/Users/hp/Downloads/signature.jpg';
            fs.unlinkSync(filePath);
            res.render('home.ejs');
        })
    }
    else if (page == 'all') {
        pdfparse(pdffile).then(function (data) {
            count = data.numpages;
            for (var i = 1; i <= count; i++) {

                pdfDoc
                    .editPage(i)
                    .text('Signature Here', one, two, { color: '#050505', fontSize: 9 })
                    .rectangle(one, two + 10, 102, 59, { stroke: '#050505', lineWidth: 1 })
                    .image('C:/Users/hp/Downloads/signature.jpg', one + 1, two + 11, { width: 100, keepAspectRatio: true })
                    .text(str, one, two + 70, { color: '#050505', fontSize: 9 })
                    .endPage()
            } pdfDoc
                .endPDF();
            var filePath = 'C:/Users/hp/Downloads/signature.jpg';
            fs.unlinkSync(filePath);
            res.render('home.ejs');
        })
    }
})

app.get('/', function (req, res) {
    res.render('login.ejs');
});





app.listen(app.get('port'), function () {
    console.log('Node server is running on port ' + app.get('port'));
});