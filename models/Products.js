const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//@desc create a schema for the product models
const productSchema = new Schema({
    name : {
        type: String,
        required : true
    },
    price: {
        type : Number,
        required : true
    },
    image :[{
        type : String,
        required : true
     }]
});

module.exports = mongoose.model('product', productSchema);