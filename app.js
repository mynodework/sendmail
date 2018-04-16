const express = require('express');
const http = require("http");
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const bodyParser = require("body-parser");

const config = require('./config');

const app = express();

app.server = http.createServer(app);

app.use(bodyParser.json({
    limit: '100kb'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/sendmail', function(req, res){
	let mailer = nodemailer.createTransport(smtpTransport({
                host: config.smtp_host,
                port: config.port,
                auth: {
                    user: config.username,
                    pass: config.password
                }
            }));

            mailer.sendMail({
                from: config.username,
                to: req.body.email,
                subject: "customer Query",
                html: req.body.message,
            }, (error, response) => {
                if (error) {
                    res.status(400).json("Invalid Smtp Information");
                } else {
                    res.json({ message: "messsage send successfully", status: 1, email_response: response});
                }
                mailer.close();
            });
})
app.listen(3000);
console.log("server is running on port 3000")