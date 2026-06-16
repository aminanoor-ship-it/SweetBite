const { verifyToken } = require('../utils/token');
const UserModel = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'Authentication is required.' });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ success: false, message: 'Your login token is invalid or expired.' });
  }

  const user = await UserModel.findById(payload.id);
  if (!user || user.status !== 'active') {
    return res.status(401).json({ success: false, message: 'This account is unavailable.' });
  }
  req.user = user;
  next();
});

module.exports = { protect };
