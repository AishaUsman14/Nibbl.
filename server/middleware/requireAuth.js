import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    console.log('Authorization header:', authorization);

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];
    console.log('Extracted token:', token);

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        // Fix: fetch the full user doc, not just _id
        req.user = await User.findById(_id);

        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        next();
    } catch (error) {
        console.log('JWT verification error:', error.message);
        res.status(401).json({ error: 'Request is not authorized' });
    }
};

export default requireAuth;
