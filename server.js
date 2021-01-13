const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const dotenv = require('dotenv');
const expressSesssion = require('express-session');
const passport = require('passport');
var createError = require('http-errors');
var { Issuer, Strategy } = require('openid-client');

//local js
const imageSchema = require('./imageSchema.js')
const multerUpload = require('./upload.js')

dotenv.config();


const uri = "mongodb+srv://" + process.env.user1 + ":" + process.env.pass1 + "@" + process.env.cluster + ".rrmwx.mongodb.net/images?retryWrites=true&w=majority";
//connect the database
const mongoClient = new MongoClient(uri, { useNewUrlParser: true });

//configure express
var app = express();
app.set('view engine', 'ejs');

//create index route
app.get('/', function (req, res) {
  res.render('index');
});

//Issuer openid-client for authentication
Issuer.discover(process.env.issuer) // => Promise
  .then(function (newIssuer) {
    var client = new newIssuer.Client({
      client_id: process.env.clientID,
      client_secret: process.env.clientSecret,
      redirect_uris: ['http://localhost:3000/auth/callback'],
      post_logout_redirect_uris: ['http://localhost:3000/logout/callback'],
      token_endpoint_auth_method: process.env.endpoint
    })
    // console.log('Discovered issuer %s %O', googleIssuer.issuer, googleIssuer.metadata);

    //Creating sessions and passport use
    app.use(
      expressSesssion({
        secret: process.env.expressSecret,
        resave: false,
        saveUninitialized: true
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());


    passport.use(
      'oidc',
      new Strategy({ client }, (tokenSet, userinfo, done) => {
        return done(null, tokenSet.claims());
      })
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    //get auth
    app.get('/auth', (req, res, next) => {
      passport.authenticate('oidc', { acr_values: 'urn:grn:authn:fi:all' })(req, res, next);
    });

    app.get('/auth/callback', (req, res, next) => {
      passport.authenticate('oidc', {
        successRedirect: '/users',
        failureRedirect: '/'
      })(req, res, next);
    });



  });

//view iamge
app.get('/view/:imageID', function (req, res) {
  // var a = getImage(req.params.imageID);
  // var encoded = encode(a.Body);

  res.render('pages/imagetemplate', { image: "abc" });

});

//view pages of images
app.get('/views/:page', function (req, res) {
  // var a = getPage(parseInt(req.params.page), 3)
  // console.log(a)
  mongoClient.connect(err => {
    const collection = mongoClient.db("images").collection("details");
    const options = {
      skip: parseInt(req.params.page),
      limit: 3,
    }

    collection.find({}, options).toArray(function (err, result) {
      if (err) throw err;
      res.render('pages/gallery', { images: result })
    })

  });
  //console.log(res);
})

//upload path
app.get('/upload', function (req, res) {
  res.render('pages/upload');
});

//user uploads a single file
app.post("/upload", multerUpload.upload.array('file', 1), (req, res) => {
  imageSchema.createImage(req.body.name, req.body.price)
});

//user uploads multiple files
app.post('/uploads', multerUpload.upload.array('files', 12), function (req, res) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  req.files.forEach(function (obj) {
    imageSchema.createImage(obj.originalname, 1);
  });
});

//no path found
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//encode images
function encode(data) {
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64
};


const port = process.env.PORT;



app.listen(port);

//need to do

//create simple template for pages
//scroll through mongodb database for images
//able to add images and descriptions to both db and s3
// create constraints and create default prices
//buy and sell

//refactor code, place it in specific folders
//add router

//retrieving single images work