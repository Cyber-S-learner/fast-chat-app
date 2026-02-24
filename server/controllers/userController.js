import tryErrorHandler from "../handlers/try-errorHandler.js"
import User from "../models/user.js"
import cloudinary from "../config/cloudinary.js"

const getLoggedInUserController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                message: 'you are not logged in',
                success: false
            })
        }

        res.status(200).json({
            message: 'logged in user fetched successfully',
            success: true,
            data: req.user
        })
    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }
}

const getAllLoggedInUsers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                message: 'you are not logged in',
                success: false
            })
        }


        const allUsers = await User.find({ _id: { $ne: req.user._id } }).select('-__v')
        res.status(200).json({
            message: "All logged in users fetched successfully",
            success: true,
            allUsers: allUsers
        })
    } catch (error) {
        res.status(400).json(tryErrorHandler(error))
    }

}

const updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const userId = req.user._id;

        let profilePicUrl = req.user.profilePic;

        if (req.file) {
            // Upload to cloudinary
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
                folder: 'fast-chat'
            });
            profilePicUrl = result.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, profilePic: profilePicUrl },
            { new: true }
        );

        res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            data: updatedUser
        });

    } catch (error) {
        res.status(400).json(tryErrorHandler(error));
    }
}

export { getLoggedInUserController, getAllLoggedInUsers, updateUserProfile }
