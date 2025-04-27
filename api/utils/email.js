// utils/email.js
const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
 host: 'ssl0.ovh.net', // OVH SMTP server
  port: 465, // SSL port
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email sending function
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from:"nourderouich159@gmail.com",
      to,
      subject,
      text,
      html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };