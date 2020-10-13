//@desc:require all packages
const express = require('express');
const mongoose = require('mongoose');


//@desc:require routes
const homePageRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

//@desc: intialise express in app
const app = express();

//@desc: intialise json middleware in app
app.use(express.json());
app.use('/uploads',express.static('uploads'));


//@desc connect to database
require('./config/db');


//@desc: use routes
app.use('/api/products', homePageRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status= 404;
    next(error);

});

app.use((error, req, res, next)=>{
res.status(error.status || 500);
res.json({
  error :{
    message : error.message
  }
});
});
//@desc:listening to port 
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
