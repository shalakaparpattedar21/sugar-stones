import jwt from 'jsonwebtoken';

const getToken = req =>
  req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;

// Requires a valid login.
const authMiddleware = (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Guests allowed, but if a valid token is sent, req.user is filled in
// (this is what links orders to the logged-in customer).
export const optionalAuth = (req, res, next) => {
  const token = getToken(req);
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch { /* treat as guest */ }
  }
  next();
};

export default authMiddleware;
