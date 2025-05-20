const jwt = require('jsonwebtoken');
const middlemanModel = require('./Middleman/middlemanModel');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(' ')[1];
  console.log('Received Token:', token);

  if (!token) {
    console.log('No token found in headers.');
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);

    // Temporarily skipping database check
    req.user = { id: decoded.id }; // still attach something useful
    next();

    // const middleman = await middlemanModel.findById(decoded.id);
    // if (!middleman) {
    //   return res.status(401).json({ success: false, message: 'Middleman not found' });
    // }
    // req.user = middleman;
    // next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid Token. Please log in again.' });
  }
};

module.exports = authMiddleware;
