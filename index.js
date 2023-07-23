const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Secret key for JWT token signing
const jwtSecret = 'Richa22#';

// Sample user data (should be fetched from your database)
const user = {
  id: '1',
  name: 'Sarman Singh',
  email: 'sarman@example.com',
};

// Authentication endpoint to generate JWT token
app.post('/login', (req, res) => {
  // Generate a JWT token
  jwt.sign(user, jwtSecret, (err, token) => {
    if (err) {
      console.error('Error generating token:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ token });
  });
});

// Protected route that requires authentication
app.get('/protected-route', authenticateToken, (req, res) => {
  // Access the authenticated user data with req.user
  console.log('Authenticated user data:', req.user);
  res.send('Protected Route');
});

// Middleware for token verification
function authenticateToken(req, res, next) {
  // Get the token from the request header
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token found, authorization denied' });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
    req.user = user; // Attach the user data to the request object
    next();
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
