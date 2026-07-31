const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const blacklistModel = require('../models/blacklist.model');
const redis = require('../config/cache'); //Redis cache

const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const isAlreadyRegistered = await userModel.findOne({ $or: [{ username }, { email }] });

        if (isAlreadyRegistered) {
            return res.status(400).json({ message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ username, email, password: hashedPassword }); // Create a new user instance with the hashed password

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('token', token);

        await user.save();

        return res.status(201).json(
            {
                message: "User registered successfully",
                user: { username: user.username, email: user.email }
            });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    try {
        const { email, username, password } = req.body;
        const user = await userModel.findOne(
            { $or: [{ email }, { username }] }
        ).select('+password'); // Include the password field in the query result
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" }); //! User not found
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials" }); //! Password does not match
        }
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.cookie('token', token);

        return res.status(200).json(
            {
                message: "User logged in successfully",
                user: { username: user.username, email: user.email }
            });
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getMe(req, res) {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message: "User fetched successfully",
        user: { username: user.username, email: user.email }
    })
}

async function logoutUser(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "No token found" });
    }
    res.clearCookie('token');

    await redis.set(token, Date.now().toString(), 'EX', 3600); // Set the token in Redis with an expiration time of 1 hour

    res.status(200).json({ message: "User logged out successfully" });
}
module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
} 