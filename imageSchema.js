var mongoose = require('mongoose');
const dotenv = require('dotenv');

var imageSchema = mongoose.Schema;

var ImageModelSchema = new imageSchema({
    name: String,
    date: { type: Date, default: Date.now },
    price: Number
})

var imageModel = mongoose.model('details', ImageModelSchema)
const uri = "mongodb+srv://" + process.env.user + ":" + process.env.pass + "@" + process.env.cluster + ".rrmwx.mongodb.net/images?retryWrites=true&w=majority";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, })


//schema functions
function createImage(name, price) {
    //create new image in db
    const instance = new imageModel();
    instance.name = name;
    instance.price = price;
    id = null;
    return instance.save(function (err, newImage) {
        if (err) {
            console.log(err)
        } else {
            console.log(newImage._id)
            //return newImage._id

        }
    });
    //also include s3 adding

}
createImage("abc", 3)
exports.createImage = createImage;