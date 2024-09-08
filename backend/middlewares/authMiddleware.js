const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Decode the token and attach the user to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // You can return the decoded token data here if necessary for the current route
    return res.json({ user: decoded });
    
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
