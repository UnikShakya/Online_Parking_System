const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token;  // Assuming token is sent as 'token' in headers
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach the decoded token (which includes userId) to the req object
        next();
    } catch (error) {
        return res.json({ success: false, message: 'Invalid Token. Please log in again.' });
    }
};

module.exports = authMiddleware;
