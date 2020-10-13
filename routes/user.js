const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');


//@desc require Users models
const User = require('../models/User');

//@desc creating a new users
//@meth POST
//@route /users
//@auth Public
router.post('',[
    //@desc perfom checks on user data with express-validator
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password with at least 6 characters').isLength({min : 6}),
], async (req, res)=>{
    
    //@desc Check if validation results have errors
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         res.status(400).json({
             errors: errors.array()
         });
     }
     //@destructure the body
     let { email, password} = req.body;

    //@desc Create a new user and save to database
    try {
        
        //@desc before saving to the database, we have to check if email address has been used
        let user = await User.findOne({email });
        
        //@desc  return a 400 staus if the user exist
        if(user){
            res.status(400).json({
                message : "User already exist"
            });
        }
    
        //@desc create an instance of a user
        user = new User({
            email,
            password 
        });

        //@desc before saving to database , hash the password
        const salt =    await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        //@desc save the user with an encrypted password
        await user.save();

        //@desc create a token and send it back to the user

        //@desc create a payload
         const payload = {
             user :{
                 id : user.id
             }
         };
        //@desc sign the token
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:3600},( error, token)=>{
            if(error) throw error;
            res.json({token})
        });
        
        
    } catch (error) {
       console.error(error.message);
       res.status(500).json({
           message : error.message
       }); 
    }
    
});
//@desc Adding a new user
//@meth GET
//@route /users/:id
//@auth Private
router.get('/:id',async (req, res)=>{
   
    //@desc fetch orders from database
    try {
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

//@desc Deleting a  users
//@meth DELETE
//@route /users/:1
//@auth Private
router.delete('/:id', async(req, res)=>{
    //@desc find order by ID and remove
    try {
       
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message : "Server error"
        });
    }
});

module.exports = router;