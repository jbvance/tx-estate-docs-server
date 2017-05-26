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
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
};

exports.send = (options, callback) => {
  const mailOptions = {
    from: 'Jason Vance <noreply@txestatedocs.com>',
    to: 'jbvance@gmail.com', //options.user.email,
    subject: 'TX Estate Docs Email', //options.subject,
    html: '<h1>Hello World 1</h1>',
    text: 'Hellow World!', //text,
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
};
