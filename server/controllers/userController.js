import tryErrorHandler from "../handlers/try-errorHandler.js"
import User from "../models/user.js"

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

export { getLoggedInUserController, getAllLoggedInUsers }