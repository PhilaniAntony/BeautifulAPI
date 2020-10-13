const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');


//@desc require Users models
const User = require('../models/User');
//@desc getting signed user info
//@meth GET
//@route /auth
//@auth Private
router.get('', auth, async(req, res)=>{

    try {
        const user = await (await User.findById(req.user.id)).isSelected('-password');
        res.json(user)
    } catch (error) {
        console.error(error.message);
       res.status(500).json({
           message : error.message
       }); 
    }

});


//@desc sign in
//@meth POST
//@route /auth
//@auth Public
router.post('',[
    //@desc perfom checks on user data with express-validator
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password with at least 6 characters').exists(),
], async (req, res, next)=>{
    
    //@desc Check if validation results have errors
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         res.status(400).json({
             errors: errors.array()
         });
     }
     //@destructure the body
     let {email, password} = req.body;

    //@desc Create a new user and save to database
    try {
        //@sesc check if user exisist
        let user = User.findOne({email});

        if(!user){
            res.status(400).json({
                message : "Invalid credentials"
            });
        };

        //@desc if user exist, verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({
                message : "Invalid credentials"
            });
        }

        //@desc if both email and password are verified, create a token for the user
        const payload = {
            user : {
                id : user.id
            }
        };
        //@des sign the payload 
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn:3600}, ( error, token)=>{
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

module.exports = router;