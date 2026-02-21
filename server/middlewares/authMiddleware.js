import jwt from 'jsonwebtoken'
import User from '../models/user.js';
import tryErrorHandler from '../handlers/try-errorHandler.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token" });

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(400).json({
                message: 'your are not logged in',
                success: false
            }
            )
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    
        const user = await User.findById(decodedToken.userId).select('-__v');

        if (!user) {
            return res.status(400).json({
                message: 'you are not authorized user',
                success: false
            })
        }

        

        req.user = user;

        next()
    } catch (error) {
        res.status(400).json(
            tryErrorHandler(error)
        )
    }

}

export default authMiddleware