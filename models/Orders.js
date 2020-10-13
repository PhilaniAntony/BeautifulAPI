const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//@desc create a schema for the order models
const  orderSchema= new Schema({
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'product',
        required : true
    },
    quantity: {
        type : Number,
        default : 1
    }
});

module.exports = mongoose.model('order', orderSchema);