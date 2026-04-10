import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );

  // set JWT as an jwt to HTTP-only
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

return token;
}

export default generateToken
