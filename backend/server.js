require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const rateLimit = require('express-rate-limit');

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased from 100 to avoid 429s with polling/chat
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/', limiter);

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "https://sevo-secure-voice-nine.vercel.app"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));

// Set COOP header for Google Auth
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

app.use(express.json());

// Socket.io Setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://sevo-secure-voice-nine.vercel.app"],
        methods: ["GET", "POST"]
    }
});

app.set('io', io);

const onlineUsers = new Set(); // Track online user IDs

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined room ${conversationId}`);
    });

    socket.on('join_personal', (userId) => {
        socket.userId = userId;
        socket.join(userId);
        console.log(`User ${socket.id} joined personal room ${userId}`);

        onlineUsers.add(userId);
        io.emit('online_users_update', Array.from(onlineUsers));
    });

    socket.on('typing_start', ({ conversationId, receiverId }) => {
        if (conversationId) socket.to(conversationId).emit('typing_start', { senderId: socket.userId, conversationId });
        if (receiverId) socket.to(receiverId).emit('typing_start', { senderId: socket.userId, conversationId });
    });

    socket.on('typing_stop', ({ conversationId, receiverId }) => {
        if (conversationId) socket.to(conversationId).emit('typing_stop', { senderId: socket.userId, conversationId });
        if (receiverId) socket.to(receiverId).emit('typing_stop', { senderId: socket.userId, conversationId });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (socket.userId) {
            // Delay slightly to confirm true disconnect vs reload
            setTimeout(() => {
                const userRoom = io.sockets.adapter.rooms.get(socket.userId);
                if (!userRoom || userRoom.size === 0) {
                    onlineUsers.delete(socket.userId);
                    io.emit('online_users_update', Array.from(onlineUsers));
                }
            }, 500);
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sevo';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
