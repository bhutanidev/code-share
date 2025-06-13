import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import authRouter from "./route/auth.route"
import cookieParser from "cookie-parser";
import cors from 'cors'
import errorHandler from "./middleware/errorHandles";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import promptRouter from './route/prompt.route';


const app = express()
app.use(express.json())
app.use(cookieParser("igsigoig93209h"))
//change it to env
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
const allowed = ['http://localhost:3002', 'http://localhost:3000' ]
app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: allowed, // use http:// not ws://
    credentials: true
  }));

app.use('/api',authRouter)
app.use('/api',promptRouter)
app.use(errorHandler)

app.listen(3001,()=>console.log("http server running on port: 3001",))
