const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//@desc create a schema for the user models
const userSchema = new Schema({
    email: {
        type : String,
        required : true
    },
    password :{
       type : String,
       required : true 
    },
    date:{
        type : Date,
        default: Date.now
    },
    orders : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'order'
    }
});

module.exports = mongoose.model('user', userSchema);