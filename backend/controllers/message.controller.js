import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  // get all users except for self
  try {
    const loggedInUserId = req.user._id;

    // All users except the currently logged in user. Everything except the password to be fetched
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to open chat and get full chat history in chronological order
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id; // Currently authenticated user

    // Find all IDs where either I am sender and other is receiver or vice versa
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async(req,res)=>{
    try {
        const {text,image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;   
        // If user sends image
        if(image){
            // Upload to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // Real time Functionality using socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
};