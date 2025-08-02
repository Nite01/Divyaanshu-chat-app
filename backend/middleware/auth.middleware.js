import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

export const protectRoute = async(req,res,next)=>{
    try {
        // Check if there is token or not
        const token = req.cookies.jwt

        if(!token)  return res.status(401).json({message:"Unauthorized - No Token provided!"});

        // If token IS present, verify it using Secret key
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({message:"Unauthorized - Token Invalid!"});

        const user = await User.findById(decoded.userId).select("-password");   // Dont send password back to client
        
        // User not found
        if(!user) return res.status(404).json({message:"User not found"})
        

        // If user is authenticated
        req.user = user     // Add user to database
        next()              // Call next()
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}