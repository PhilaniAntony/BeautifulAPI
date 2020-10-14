const mongoose = require('mongoose');
const config = require('config');



const connectDB = async()=>{
   //@desc connect to database
    try {
        await mongoose.connect(config.get("mongoURI"),{
            useNewUrlParser: true ,
            useUnifiedTopology: true
            },()=>{
            console.log('Connected to database');
        })
    } catch (error) {
       console.error(error.message); 
    }
}
module.exports = connectDB();