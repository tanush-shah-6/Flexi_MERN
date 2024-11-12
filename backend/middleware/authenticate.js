const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const user = await User.findById(decoded.userId); // Find the user based on decoded token

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user; // Attach user to the request object
        next(); // Proceed to the next middleware or route
    } catch (err) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authenticate;
