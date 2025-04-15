import express, { Router } from "express"
import { createRoomController, joinRoomController, leaveRoomController, signinController, signupController } from "../controller/auth.controller"
import { attachUser } from "../middleware/auth.middleware"

const authRouter:Router = express.Router()
authRouter.get("/test",(req,res)=>{res.send('hello from backend')})
authRouter.post("/signup",signupController)
authRouter.post("/signin",signinController)
authRouter.post("/createroom",attachUser,createRoomController)
authRouter.post("/leaveroom",attachUser,leaveRoomController)
authRouter.post("/joinroom",attachUser,joinRoomController)





export default authRouter