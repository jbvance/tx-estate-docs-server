const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  return  new Promise((resolve, reject) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    resolve(inlined);
  });
};

exports.send = (options, callback) => {
  generateHTML(options.filename, options)
    .then((html) => {
      console.log("HTML", html);
      //const html = generateHTML(options.filename, options);
      const text = htmlToText.fromString(html);
      const mailOptions = {
        from: 'Jason Vance <noreply@txestatedocs.com>',
        to: options.user.email,
        subject: options.subject,
        html,
        text,
      };
      //send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error){
          console.log(error);
          callback(error, null);
          return;
        }
        console.log(`Message ${info.messageId} sent: ${info.response}`);
        callback(null, { info: `Message ${info.messageId} sent: ${info.response}`});
      });
    });
};
