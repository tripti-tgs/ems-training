const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  let userId;
  if (user._id) {
    userId = user._id.valueOf();
  } else if (user.id) {
    userId = user.id;
  } else {
    throw new Error('Invalid user object');
  }

  return jwt.sign(
    {
      userId: userId,
      username: user.username,
      email: user.email
    },
    'secretKey',
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
