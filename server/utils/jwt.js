const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email
    },
    'secretKey',
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
