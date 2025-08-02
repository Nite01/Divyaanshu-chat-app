import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required!"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be atleast 6 characters"});
        }
        const user = await User.findOne({email})        // Check whether user exists
        if(user) return res.status(400).json({message:"Email already exists"});

        // Create salt
        const salt = await bcrypt.genSalt(10)       

        // Hash the password
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            // Generate JWT Token
            generateToken(newUser._id,res)
            await newUser.save();               // Save user to database
            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({message:"Invalid user data"})
        }
    } catch (error) {
            console.log(error.message);
            res.status(500).json({message:"Internal Server Error"})
    }
};
export const login = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email})

        if(!user) return res.status(400).json({message:"Invalid Credentials"})

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"})

        // If password correct, generate JWT
        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }
};
export const logout = (req,res)=>{
    // Clear out the cookies
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Sever Error"})
    }
};

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;          // Grab profile pic from user request
        const userId = req.user._id;

        if(!profilePic) return res.status(400).json({message:"Profile Pic required"});

        // If profile pic provided, upload to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);       // Upload pic to cloudinary

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in update profile controller")
        res.status(500).json({message:"Internal Server Error"})
    }
};

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

