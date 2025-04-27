// test-email.js
require('dotenv').config();
const { sendEmail } = require('./utils/email');

async function testEmail() {
  try {
    console.log('Testing OVH email configuration...');
    console.log(`Using email: ${process.env.EMAIL_USER || 'Not set'}`);
    
    // Hide the password but show if it's set
    const passwordSet = process.env.EMAIL_PASSWORD ? 'Yes (hidden)' : 'Not set';
    console.log(`Password configured: ${passwordSet}`);
    
    const recipient = process.env.TEST_EMAIL_RECIPIENT || process.env.EMAIL_USER;
    console.log(`Sending test email to: ${recipient}`);
    
    const result = await sendEmail(
      recipient,
      'Test Email from Project Management System',
      'This is a test email from the project management system',
      '<h1>Test Email</h1><p>This is a test email from the project management system</p>'
    );
    
    console.log('Email sent successfully!');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.error('Failed to send email:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\nAuthentication failed. Please check:');
      console.log('1. Your email credentials in the .env file are correct');
      console.log('2. The SMTP server settings match OVH\'s requirements');
    }
  }
}

testEmail();