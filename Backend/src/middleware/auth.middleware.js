const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized User" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded;
            next();
        }catch (error) {
            return res.status(401).json({message: `${error} `});
        }
    }
    catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    authUser
};