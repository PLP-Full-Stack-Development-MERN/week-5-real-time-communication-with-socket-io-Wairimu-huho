const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const joi = require('joi'); // for data validation
const moment = require('moment');  // for handling dates in notes
const notesRoutes = require('./routes/notes');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

//make io accessible to the routes
app.set('io', io);

//middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

//mounting the routes
app.use('/api/notes', notesRoutes);

//testing route
app.get('/', (req, res) => {
    res.send('Real-time Notes API is running');
});
//connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Database Connected"))
.catch(err => console.log("MongoDB error:", err));

//handling socket connections
// Room management
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join room event
  socket.on('join_room', (data) => {
    const { roomId, username } = data;
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
    }
    
    // Add user to room
    rooms[roomId].users.push({
      id: socket.id,
      username
    });
    
    // Store room info in socket for disconnect handling
    socket.roomId = roomId;
    socket.username = username;
    
    // Notify room about new user
    io.to(roomId).emit('user_joined', {
      users: rooms[roomId].users,
      message: `${username} has joined the room`
    });
  });
  
  // Handle note updates
  socket.on('update_note', (data) => {
    const { note, roomId } = data;
    socket.to(roomId).emit('note_updated', note);
  });
  
  // Handle user typing indicator
  socket.on('typing', (data) => {
    const { roomId, username } = data;
    socket.to(roomId).emit('user_typing', { username });
  });
  
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.roomId) {
      // Remove user from room
      const roomId = socket.roomId;
      if (rooms[roomId]) {
        rooms[roomId].users = rooms[roomId].users.filter(
          user => user.id !== socket.id
        );
        
        // Notify room about user leaving
        io.to(roomId).emit('user_left', {
          users: rooms[roomId].users,
          message: `${socket.username} has left the room`
        });
        
        // Clean up empty rooms
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});
server.listen(process.env.PORT || 5000, () => {
    console.log(`server is running on port ${process.env.PORT || 5000}`);
});