// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const twilio = require('twilio'); // Twilio API library

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Twilio configuration
const twilioConfig = {
  accountSid: 'your_account_sid',
  authToken: 'your_auth_token',
  twilioNumber: 'your_twilio_phone_number',
};

// Twilio client
const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

// Request to generate and send password reset token
app.post('/forgot-password', (req, res) => {
  const { phoneNumber } = req.body;

  // Generate random token
  const token = generateToken();

  // Set token expiration to 1 hour from now
  const expiration = new Date(Date.now() + 60 * 60 * 1000);

  // Update the user's password_reset_token and password_reset_expiration in the database
  const updateQuery = `UPDATE users SET password_reset_token = ?, password_reset_expiration = ? WHERE phone_number = ?`;
  pool.query(updateQuery, [token, expiration, phoneNumber], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Send the token via SMS using Twilio
    sendSMS(phoneNumber, `Your password reset token is: ${token}`)
      .then(() => {
        return res.json({ message: 'Token sent successfully' });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send token via SMS' });
      });
  });
});

// Request to verify the password reset token and update the password
app.post('/reset-password', (req, res) => {
  const { phoneNumber, token, newPassword } = req.body;

  // Check if the provided token and phone number match a user in the database
  const selectQuery = `SELECT * FROM users WHERE phone_number = ? AND password_reset_token = ? AND password_reset_expiration > NOW()`;
  pool.query(selectQuery, [phoneNumber, token], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid phone number or token' });
    }

    // Update the user's password and clear the password_reset_token and password_reset_expiration
    const updateQuery = `UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expiration = NULL WHERE phone_number = ?`;
    pool.query(updateQuery, [newPassword, phoneNumber], (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.json({ message: 'Password reset successfully' });
    });
  });
});

// Helper function to generate a random token
function generateToken() {
  // Generate a random 6-digit number as the token
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to send SMS using Twilio
function sendSMS(toPhoneNumber, message) {
  return client.messages.create({
    body: message,
    from: twilioConfig.twilioNumber,
    to: toPhoneNumber,
  });
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
