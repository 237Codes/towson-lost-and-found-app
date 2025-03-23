// const sgMail = require('@sendgrid/mail');
// require('dotenv').config();

// // Verify we have API key
// if (!process.env.SENDGRID_API_KEY) {
//   console.error('SENDGRID_API_KEY is missing in .env file');
//   process.exit(1);
// }

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// // Create simple test message
// const msg = {
//   to: 'manjori1@students.towson.edu', // Replace with your test Towson email
//   from: process.env.SENDGRID_FROM_EMAIL, // Must be your verified sender
//   subject: 'TU Lost and Found - Email Test',
//   text: 'This is a test email from TU Lost and Found app',
//   html: '<strong>This is a test email from TU Lost and Found app</strong>',
// };

// // Send test email
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Test email sent successfully');
//   })
//   .catch((error) => {
//     console.error('Error sending test email:');
//     console.error(error.response.body);
//   })


const emailService = require('./emailService.js');

async function testEmailVerification() {
  try {
    const testEmail = 'manjori1@students.towson.edu'; // Replace with your Towson email
    const verificationCode = emailService.generateVerificationCode();
    
    console.log(`Sending verification code ${verificationCode} to ${testEmail}`);
    
    const result = await emailService.sendVerificationEmail(testEmail, verificationCode);
    
    if (result.success) {
      console.log('✅ Verification email sent successfully');
    } else {
      console.error('❌ Failed to send verification email:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmailVerification();