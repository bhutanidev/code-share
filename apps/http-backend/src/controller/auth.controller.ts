import ApiError from "../utils/ApiError";
import apiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateUserSchema , SigninUserSchema , CreateRoomSchema} from "@workspace/common/zodschema"
import {prismaClient} from "@workspace/db/client"
import jwt from "jsonwebtoken"
import { comparePassword,hashPassword } from "../utils/Encryption";
const JWT_SECRET = process.env.JWT_SECRET as string


export const signupController=asyncHandler(async(req,res,next)=>{
    const {password, email , name}=req.body
    const psdata = CreateUserSchema.safeParse(req.body)
    if(!psdata.success){
        next(new ApiError(400,psdata.error.message))
        return
    }
    // const found = await prismaClient.user.findFirst({
    //     where:{
    //         email:email
    //     }
    // })
    // console.log(found)
    // if(found){
    //     next(new ApiError(400,"Email already exists"))
    //     return;
    // }
    try {
        const hashedpw = await hashPassword(password)
        const newentry = await prismaClient.user.create({
            data:{
                email:psdata.data?.email,
                password:hashedpw as string,
                name:psdata.data?.name
            }
        })
        if(!newentry){
            next(new ApiError(500,"Database error"))
            return
        }
        res.status(200).json(new apiResponse(200,{email:newentry.email,name:newentry.name},"User created succsessfully"))
    } catch (error) {
        next(new ApiError(400,"Email already exists"))
        return;
    }
})

export const signinController=asyncHandler(async(req,res,next)=>{
    const {password, email }=req.body
    const psdata = SigninUserSchema.safeParse(req.body)
    if(!psdata.success){
        next(new ApiError(400,psdata.error.message||"Fill the fields correctly"))
        return;
    }
    //add cookie
    const found = await prismaClient.user.findFirst({
        where:{
            email:psdata.data.email
        }
    })
    if(!found){
        next(new ApiError(400,"Email does not exist"))
        return;
    }
    const match = await comparePassword(password,found.password)
    if(!match){
        next(new ApiError(400,"Incorrect Password"))
        return
    }
    console.log(JWT_SECRET)
    const token = jwt.sign({id:found.id,email:found.email,name:found.name},JWT_SECRET)
    res.cookie("token",token).status(200).json(new apiResponse(200,{email},"User logged in"))
})

export const createRoomController=asyncHandler(async(req,res,next)=>{
    const psdata = CreateRoomSchema.safeParse(req.body)
    if(!psdata.success){
        next(new ApiError(400,psdata.error.message||"Fill the fields correctly"))
        return;
    }
    //add cookie
    const userId = req.userId
    if(typeof userId === undefined || !userId){
        next(new ApiError(400,"Unauthorized"));
        return
    }
    const found = await prismaClient.room.findFirst({
        where:{
            slug:psdata.data.slug
        }
    })
    
    if(found){
        next(new ApiError(400,"Room name already exists"))
        return;
    }
    try {
            const newentry = await prismaClient.room.create({
                data:{
                    slug:psdata.data.slug,
                    adminId:userId
                }
            })
            if(!newentry){
                next(new ApiError(500,"Database error"))
                return
            }
            res.json(new apiResponse(200,{slug:newentry.slug,id:newentry.id,adminId:newentry.adminId},"Room created successfully"))
            return
    } catch (error) {
        next(new ApiError(500,"db error"))
        return
    }
})


module.exports={
    signupController,
    signinController,
    createRoomController
}