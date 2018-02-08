var config = require('../../config');
var jwt = require('jsonwebtoken');

module.exports = {

    verifyToken: ( (req, res, next) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if( token ) {

            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    console.log("Failed to authenticate token.")
                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // all good, continue
                    console.log("Token ok")
                    req.decoded = decoded; 
                    next();
                }
            });

        }  else {

            res.send({ success: false, message: 'No token exists.' });
            
        }
    })

}