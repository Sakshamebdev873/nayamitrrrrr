import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import authRouter from './routes/authRoutes.js'
import chatRouter from './routes/chatRoutes.js'
const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser('secret'))
app.use('/api/v1',authRouter)
app.use('/api/v1',chatRouter)

const port = process.env.PORT || 5200;
const start = async () =>{
try {
    await mongoose.connect(process.env.MONGO_URL)
app.listen(port,() =>{
    console.log(`Server is listening on port ${port}....`);
})
} catch (error) {
    console.log(error);
}
}
start()