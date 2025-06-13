import e, { Router } from "express"
import { attachUser } from "../middleware/auth.middleware"
import { analyzeCodeHandler } from "../controller/prompt.controller"

const promptRouter:Router = e.Router()

promptRouter.post('/analyze-code' , attachUser , analyzeCodeHandler)

export default promptRouter