const express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// View engine setup
app.engine('handlebars', exphbs({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: "",
 }));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message:</h3>
        <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.google.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'mathis.peingnez@gmail.com', // generated ethereal user
            pass: '07222207'  // generated ethereal password
        },
        tls:{
        rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <mathis.peingnez@gmail.com>', // sender address
        to: 'mathis.peingnez@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg:'Email has been sent'});
    });

    // // async..await is not allowed in global scope, must use a wrapper
    // async function main(){

    //     // Generate test SMTP service account from ethereal.email
    //     // Only needed if you don't have a real mail account for testing
    //     let testAccount = await nodemailer.createTestAccount();
    
    //     // create reusable transporter object using the default SMTP transport
    //     let transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: 'Tanner Hegmann', // generated ethereal user
    //         pass: '4nWX57cyNdByDrQkFr' // generated ethereal password
    //     },
    //     tls:{
    //         rejectUnauthorized:false
    //     }
    //     });
    
    //     // send mail with defined transport object
    //     let info = await transporter.sendMail({
    //     from: '"Tanner Hegmann" <tanner68@ethereal.email>', // sender address
    //     to: "mathis.peingnez@gmail.com", // list of receivers
    //     subject: "Node Contact Request", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: output // html body
    //     });
    
    //     console.log("Message sent: %s", info.messageId);
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    //     // Preview only available when sending through an Ethereal account
    //     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    // }
    
    // main().catch(console.error);
    })

app.listen(3000, () => {
    console.log('Server started');
});