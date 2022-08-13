const { Router } = require('express');
const { route } = require('express/lib/application');
const POP3Client = require("mailpop3");
const nodemailer = require('nodemailer')
const path = require('path')
require("dotenv").config();
const router = Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

router.post('/loin', (req, res) => {
    console.log("body", req.body)
    const { email,password } = req.body;
    var client = new POP3Client(process.env.POP_SERVER_PORT, process.env.POP_SERVER_HOST, {
        tlserrs: false,
        enabletls: false,
        debug: false
    });

    //Pruebas---------------
    console.log('paso el pop3')

    client.on("error", function (err) {

        if (err.errno === 111) console.log("Unable to connect to server");
        else console.log("Server error occurred");

        console.log(err);

    });

    client.on("connect", function () {

        console.log("CONNECT success");
        client.login(email, password);

    });

    client.on("invalid-state", function (cmd) {
        console.log("Invalid state. You tried calling " + cmd);
    });

    client.on("locked", function (cmd) {
        console.log("Current command has not finished yet. You tried calling " + cmd);
    });

    client.on("login", function(status, rawdata) {
        console.log(rawdata);
        if (status) {
     
            console.log("LOGIN/PASS success");
            client.list();
     
        } else {
     
            console.log("LOGIN/PASS failed");
            client.quit();
     
        }
    });
     
    // Data is a 1-based index of messages, if there are any messages
    client.on("list", function(status, msgcount, msgnumber, data, rawdata) {
     
        if (status === false) {
     
            console.log("LIST failed");
            client.quit();
     
        } else {
     
            console.log("LIST success with " + msgcount + " element(s)");
     
            if (msgcount > 0)
                client.retr(1);
            else
                client.quit();
     
        }
    });
     
    client.on("retr", function(status, msgnumber, data, rawdata) {
     
        if (status === true) {
     
            console.log("RETR success for msgnumber " + msgnumber);
            client.dele(msgnumber);
            client.quit();
     
        } else {
     
            console.log("RETR failed for msgnumber " + msgnumber);
            client.quit();
     
        }
    });

     
    client.on("dele", function(status, msgnumber, data, rawdata) {
     
        if (status === true) {
     
            console.log("DELE success for msgnumber " + msgnumber);
            client.quit();
     
        } else {
     
            console.log("DELE failed for msgnumber " + msgnumber);
            client.quit();
     
        }
    });
     

    client.on("quit", function(status, rawdata) {
     
        if (status === true){
          res.status(200).json({
            message: 'Funciono'
          })
           console.log("QUIT success");
        }   
        else console.log("QUIT failed");
     
    });
})


//Envio del correo por mail
// router.post('/envio', (req, res) => {
//     console.log("body", req.body)
//     const { emailFrom, emailpass, emailDest, subject, text } = req.body;
    
//     // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: 'peespinosag@correo.udistrital.edu.co', // generated ethereal user
//       pass: 'toikpmzosqzqvbjt', // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   transporter.sendMail({
//     from: '"Prueba Redes SMTP ❤🥺🤞👻" <peespinosag@correo.udistrital.edu.co>', // sender address
//     to: emailDest, // list of receivers
//     subject: subject, // Subject line
//     text: text, // plain text body
//     html: "<b>"+text+"</b>", // html body
//   });

// })

router.post('/envio', (req, res) => {
  console.log("body", req.body)

  
  const { emailFrom, emailpass, emailDest, subject, text } = req.body;
  const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER_HOST,
      port: process.env.SMTP_SERVER_PORT,
      tls: {
          rejectUnauthorized: false
      },
      auth: {
          user: emailFrom,
          pass: emailpass,
      },
      
  });

  transporter.verify(function (error, success) {
      if (error) {
          console.log(error);
      } else {
          console.log("Server is ready to take our messages");
      }
  });

  const mail = {
      //sender: `${alias} <${emailFrom}>`,
      from: emailFrom,
      to: emailDest, // receiver email,
      subject: subject,
      text: text,
  };

  console.log(mail)

  //Se realiza el envío del mensaje
  transporter.sendMail(mail, (err, data) => {
      if (err) {
          console.log(err);
          res.status(500).send("Something went wrong.");
      } else {
          res.status(200).send("Email successfully sent to recipient!");
      }
  });


})

router.get('/getMails', (req, res) => {

  var client = new POP3Client(process.env.POP_SERVER_PORT, process.env.POP_SERVER_HOST, {
    tlserrs: false,
    enabletls: false,
    debug: false
  });

  

})

module.exports = router;