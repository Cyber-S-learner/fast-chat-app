import express from 'express'
import cors from 'cors'
import http from 'http'

import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/chatRoute.js'
import messageRouter from './routes/messageRoute.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

export const server = http.createServer(app)

