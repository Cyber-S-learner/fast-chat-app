import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { server } from "./app.js";
import connectDB from './config/dbConfig.js';
import initSocket from './socket/index.js';

connectDB()

// Initialize Socket.io
initSocket(server);

const port = process.env.PORT || 4001

server.listen(port, () => {
    console.log(`server running at port ${port}`)
})
