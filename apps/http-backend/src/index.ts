import express from "express"
import authRouter from "./route/auth.route"
import { JWT_SECRET } from '@workspace/backend-common/config';
import cookieParser from "cookie-parser";
import cors from 'cors'
import errorHandler from "./middleware/errorHandles";



const app = express()
app.use(express.json())
app.use(cookieParser("igsigoig93209h"))
//change it to env
const allowed = ['http://localhost:3002', 'http://localhost:3000' ]

app.use(cors({
    origin: allowed, // use http:// not ws://
    credentials: true
  }));

app.use('/api',authRouter)
app.use(errorHandler)

app.listen(3001,()=>console.log("http server running on port: 3001",))
