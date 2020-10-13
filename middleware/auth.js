const jwt = require('jsonwebtoken');
const config = require("config");

module.exports = (req, res, next)=>{
    //@desc get token from header
    const token = req.header('x-auth-token');

    //@desc check if token exist
    if(!token){
        res.status(401).json({
            message : 'No token, authorisation denied'
        });
    }
    try {
        //@desc verify the token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        //@assign token to user
        req.user = decoded.user;
        next();

    } catch (error) {
        res.status(401).json({
            message : 'Token is not valid'
        });
    }
}