let express = require('express');
let app = express();
let twig = require('twig');
let bodyParser = require('body-parser');
let helmet = require('helmet');
let email = require('emailjs');
let emailExist = require('email-existence');
let RateLimit = require('express-rate-limit');
let session = require('express-session');
let mysql = require('mysql');

let limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});

let userModel = require('../models/users');
console.log(userModel.test());

// Email configuration
let smtpServer = require('../config/email')(email);

app.set('views', 'views');
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('twig options', {
    strict_variables: false,
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false,
}));

// parse application/json
app.use(bodyParser.json());

// Security HTTP
app.use(helmet());

// Session express
app.enable('trust proxy');
app.use(session({
    secret: 'DManagerw11xh&Suf',
    resave: true,
    saveUninitialized: false
}));

app.use('/vendor', express.static('public/vendor'));
app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));

//  Apply to signin and signup routes
app.use('/signup', limiter);
app.use('/signin', limiter);

let checkAuth = (req, res, next) => {
    // if (req.url === '/' && (!req.session || !req.session.authenticated || req.session.authenticated === undefined)) {
    //     return res.redirect('/signin');
    // }

    next();
}

app.use(checkAuth);

// ROUTES
require('./routes/index').init(app, {}, {});
require('./routes/user').init(app, { emailExist: emailExist }, {});

// ALL OTHER ROUTES REDIRECT TO '/'
app.get('*', function (req, res) {
    res.redirect('/');
});

module.exports = app;