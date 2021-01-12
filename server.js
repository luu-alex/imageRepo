const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');


const imageSchema = require('./imageSchema.js')
const multerUpload = require('./upload.js')

console.log(imageSchema.createImage)

dotenv.config();
//connect the database
console.log(process.env.PORT)
console.log(process.env.user)
const uri = "mongodb+srv://" + process.env.user + ":" + process.env.pass + "@" + process.env.cluster + ".rrmwx.mongodb.net/images?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });


//configuring AWS
AWS.config.update({ region: 'us-west-2' });

s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// look at buckets
s3.listBuckets(function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    //console.log("Success", data.Buckets);
  }
});

var bucketParams = {
  Bucket: 'shopify-challenge'
}

var uploadParams = {
  Bucket: bucketParams.Bucket,
  Key: '',
  Body: ''
};

var app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
//setting middleware
app.use('/images', express.static(__dirname + '/images')); //Serves resources from public folder



//add error check l8ter


//use ejs to render pages

app.get('/', function (req, res) {
  res.render('pages/upload');
});

app.get('/view/:imageID', function (req, res) {
  // var a = getImage(req.params.imageID);
  // console.log("inside views")
  // console.log(a);
  // var encoded = encode(a.Body);

  res.render('pages/imagetemplate', { image: "abc" });

});

app.get('/views/:page', function (req, res) {
  // var a = getPage(parseInt(req.params.page), 3)
  // console.log(a)
  client.connect(err => {
    const collection = client.db("images").collection("details");
    const options = {
      skip: parseInt(req.params.page),
      limit: 3,
    }

    // perform actions on the collection object
    collection.find({}, options).toArray(function (err, result) {
      if (err) throw err;
      res.render('pages/gallery', { images: result })
    })

    // client.close();
  });
  //console.log(res);
})

app.post("/upload", multerUpload.upload.array('file', 1), (req, res) => {
  // single(req, res, (err) => {
  //     if (err) {
  //         console.log(err)
  //         res.status(400).send("There is a problem!");
  //     }
  //     else {
  //         uploadParams.Body =
  //             console.log(req.file);


  //     }
  // });
  console.log(req.body)
  console.log("stuff")
  imageSchema.createImage(req.body.name, req.body.price)
  console.log("rest api post, hit ")
});

app.post('/uploads', multerUpload.upload.array('files', 12), function (req, res) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  // console.log(req.files);
  req.files.forEach(function (obj) {
    imageSchema.createImage(obj.originalname, 1);
  });
});


// app.post('/upload', function (req, res) {
//     console.log(req);
//     if (!req.file) {
//         console.log("no file")
//     } else {
//         console.log(req.file);
//         console.log("file")
//     }
// })

function getPage(skip, limit) {

};


//add images to db
function add() {
  client.connect(err => {
    const collection = client.db("images").collection("store1");
    const result = collection.insertOne(image);

    console.log(result.insertedCount); // should print 1 on successful insert

  })
};

function getImage(name) {
  console.log("images")
  console.log(name);
  const data = s3.getObject(
    {
      Bucket: uploadParams.Bucket,
      Key: name
    }

  ).promise();
  console.log("data")
  console.log(data)
  return data;
};

function encode(data) {
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64
};


// getPage(0, 5);
const port = process.env.PORT;



var server = app.listen(port);

//need to do

//create simple template for pages
//scroll through mongodb database for images
//able to add images and descriptions to both db and s3
// create constraints and create default prices
//buy and sell

//refactor code, place it in specific folders

//done

//retrieving single images work