import jwt from 'jsonwebtoken';

export function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  // Minimal payload: userId, role
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
    },
    secret,
    {
      expiresIn: '7d',
    }
  );
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.verify(token, secret);
}
