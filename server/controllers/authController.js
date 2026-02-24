import tryErrorHandler from "../handlers/try-errorHandler.js";
import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const signUpController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('-__v');
        if (user) {
            return res.status(400).json({
                message: "user already exists",
                success: false,
                user: user
            })
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({
                message: "password should be minimum of 8 length character",
                success: false
            })
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10);

        req.body.password = hashPassword;

        const savedUser = new User(req.body);

        await savedUser.save();

        res.status(201).send({
            message: "user created successfully",
            success: true
        })

    } catch (error) {
        return res.status(400).json(tryErrorHandler(error))
    }

};

const loginController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('+ password');

        if (!user) {
            return res.status(400).json({
                message: "user does not exists. Please sign up",
                success: false
            })
        }

        const plainPassword = await bcrypt.compare(req.body.password, user.password);
        if (!plainPassword) {
            return res.status(400).json({
                message: "incorrect password",
                success: false
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })

        res.status(200).json({
            message: "user logged in successfully",
            success: true,
            token: token
        })
    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }
}

const logoutController = async (req, res) => {
    try {
        res.status(200).json({
            message: "user logged out successfully",
            success: true
        })
    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }
}

export { signUpController, loginController, logoutController };
