import express from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/chatRoute.js'
import messageRouter from './routes/messageRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

// Serve static files from the React app
const clientPath = path.join(__dirname, '../client/dist')
app.use(express.static(clientPath))

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'))
})

export const server = http.createServer(app)

