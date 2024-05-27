import jwt from 'jsonwebtoken';

interface User {
  id?: string|number ;
  _id?:string|number
  username: string;
  email: string;
  password: string|number;
}

const generateToken = (user: User): string => {
  let userId: string|number;

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
    // { expiresIn: '1h' }
  );
};

export default generateToken;
