import express from 'express'
import 'dotenv/config';
import authRoutes from './routes/authRouter.js'
import messageRoutes from './routes/messageRouter.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js' 


const PORT = process.env.PORT || 5001

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())
const allowOrigin = ["http://localhost:5173"]
app.use(cors({
    origin: allowOrigin,
    credentials: true
}
))

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

server.listen(PORT, () => {
    console.log("server is running on port " + PORT);
    connectDB()
})