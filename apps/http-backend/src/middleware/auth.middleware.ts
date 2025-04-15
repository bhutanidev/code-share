import { NextFunction , Request,Response } from "express"
import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError"
import { JWT_SECRET } from "@workspace/backend-common/config"


export const attachUser = async(req:Request,res:Response,next: NextFunction)=>{

    try {
        const token = req.cookies?.token
        if(!token){
            next(new ApiError(403,"No token found"))
            return
        }
        const key :string = "igsigoig93209h"
    
        const decoded = await jwt.verify(token,JWT_SECRET)
    
        if(decoded && typeof decoded === 'object'){
            req.userId = decoded.id
            next()
            return
        }else{
            // res.status(403).json({error:"Not logged in or invalid token"})
            next(new ApiError(403,"Not logged in or invalid token"))
            return
        }
    } catch (error) {
        console.error(error)
        next(new ApiError(403,"invalid signature"))

    }

}