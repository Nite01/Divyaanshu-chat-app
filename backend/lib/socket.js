import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

// Create HTTP server from Express app
const server = http.createServer(app);

// Create a Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Frontend origin
    methods: ["GET", "POST"],         
    credentials: true                  //  if you're using cookies or sessions
  }
});

// Listen for incoming connections
io.on("connection", (socket)=>{
    console.log("A user connected",socket.id);

    // Listen for user disconnect
    socket.on("disconnect",()=>{
        console.log("A user disconnected", socket.id);
    })
})

// Export for use in index.js
export { io, app, server };
