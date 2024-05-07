const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // const authHeader = req.headers.authorization;
    const authHeader = req.query.token;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }
  
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }
  
    try {
      const decodedToken = jwt.verify(token, 'secretKey');
      // Setting custom header
      res.setHeader('Custom-Header', decodedToken);
      req.userData = { userId: decodedToken.userId };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid Images token' });
    }
  };

module.exports = authMiddleware;
