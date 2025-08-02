import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    // Each message will have the following,
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",             // Reference to the User model
        required:true,
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    },
}, {timestamps:true}        // to show 'createdAt' of the message
)

const Message = mongoose.model("Message", messageSchema);

export default Message;