var mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

var imageSchema = mongoose.Schema;

var ImageModelSchema = new imageSchema({
    name: String,
    date: { type: Date, default: Date.now },
    price: Number
})

var imageModel = mongoose.model('details', ImageModelSchema)


//schema functions
function createImage(name, price) {
    //create new image in db
    const uri = "mongodb+srv://" + process.env.user + ":" + process.env.pass + "@" + process.env.cluster + ".rrmwx.mongodb.net/images?retryWrites=true&w=majority";

    mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, })

    const instance = new imageModel();
    instance.name = name;
    instance.price = price;
    id = null;
    return instance.save(function (err, newImage) {
        if (err) {
            console.log(err)
        } else {
            console.log("Object inserted! ID: " + newImage._id)
        }
    });


}

exports.createImage = createImage;


// client.connect(err => {
//   const collection = client.db("images").collection("details");
//   // perform actions on the collection object
//   collection.find({}).toArray(function (err, result) {
//     console.log(result)
//   })
//   client.close();
// });


