
// Import the necessary modules
const jwt = require('jsonwebtoken');

// Define the middleware function
const authenticator = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'nossosecret');

    // Attach the decoded user information to the request object
    req.user = decoded.user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Export the middleware function
module.exports = authenticator;
