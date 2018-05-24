var config = require('../../config');
var jwt = require('jsonwebtoken');

module.exports = {

    verifyToken: ( (req, res, next) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if( token ) {

            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    console.log("Fallo al autenticar el token.")
                    return res.json({ success: false, code: 'err_001', message: 'Fallo al autenticar el token. Caducado?' });    
                } else {
                    // all good, continue
                    console.log("Token ok")
                    req.decoded = decoded; 
                    next();
                }
            });

        }  else {

            res.send({ success: false, code: 'err_002', message: 'No autenticado.' });
            
        }
    })

}