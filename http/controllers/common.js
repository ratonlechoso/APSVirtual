var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var router = express.Router();
var experiencias = require('../../models/experiencia');
var config = require('../../config');
var auth = require('../middleware/auth');
var moment = require('moment')

router.post('/contact-email', (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var smtpTrans = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'hectoram@gmail.com',
            pass: 'Altair2011',
            tls: { rejectUnauthorized: false }
        }
    });

    var mailOptions = {
        to: 'hectoram@gmail.com',
        from: req.body.email,
        subject: 'ApS Virtual: Mensaje enviado desde la sección de contacto',
        text: ' Emisor: ' + req.body.name + '\n' +
              ' Email: ' + req.body.email + '\n\n' +     
              '--------------------------------------------------------------' +
              '\n\n' +
              ' Mensaje: ' + req.body.message + '\n\n'
    };

    smtpTrans.sendMail(mailOptions, function (err, info) {
        if (err) {
            let content = {
                success: false,
                message: 'Error al enviar el correo de reseteo de contraseña.',
            }
            console.log(err)
            res.send(content)
            return
        }
        let content = {
            success: true,
            message: 'Email enviado',
        }
        console.log(info) //enviado
        res.send(content)
        return
    });
});

module.exports = router;
