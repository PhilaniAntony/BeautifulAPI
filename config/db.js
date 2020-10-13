const mongoose = require('mongoose');



const connectDB = async()=>{
   //@desc connect to database
    try {
        await mongoose.connect('mongodb://localhost/cms',{
        useUnifiedTopology: true, 
        useNewUrlParser: true 
    });
    console.log('Connected to database');
    } catch (error) {
        resizeBy.statu(400).json({
            message : error.message
        })
    }
}
module.exports = connectDB();