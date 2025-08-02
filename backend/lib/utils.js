import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",        // User will have to login again after 7 days
    });

    // Send JWT in cookie to user
    res.cookie("jwt", token, {
        httpOnly: true,                         // blocks JS access to cookie
        secure: process.env.NODE_ENV !== "development", // cookie sent only over HTTPS
        sameSite: "strict",                     // prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000         // 7 days in ms 
    });

    return token;
};
