import ApiError from "../utils/ApiError";
import apiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateUserSchema , SigninUserSchema , CreateRoomSchema} from "@workspace/common/zodschema"
import {prismaClient} from "@workspace/db/client"
import jwt from "jsonwebtoken"
import { comparePassword,hashPassword } from "../utils/Encryption";
import { NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET as string


export const signupController=asyncHandler(async(req,res,next)=>{
    const {password, email , name}=req.body
    const psdata = CreateUserSchema.safeParse(req.body)
    if(!psdata.success){
        next(new ApiError(400,psdata.error.message))
        return
    }
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
    const token = jwt.sign({id:found.id,email:found.email,name:found.name},JWT_SECRET)
    res.cookie("token",token).status(200).json(new apiResponse(200,{email},"User logged in"))
})
export const logoutController = asyncHandler(async(req,res,next)=>{
    const userId = req.userId
    if(!userId){
        next(new ApiError(401,"Not authenticated"))
        return
    }
    try {
        const newentry = await prismaClient.userOnRoom.deleteMany({
            where:{
                userId:userId
            }
        })
    } catch (error) {
        console.log(error);
    } finally{
        res.status(200).clearCookie("token").json(new apiResponse(200,{},"User logged out successfully!!!"))
    }
})
export const createRoomController=asyncHandler(async(req,res,next)=>{
    const psdata = CreateRoomSchema.safeParse(req.body)
    if(!psdata.success){
        next(new ApiError(400,psdata.error.message||"Fill the fields correctly"))
        return;
    }
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
                    adminId:userId,
                    users:{
                        create:[{
                            user:{
                                connect:{id:userId}
                            }
                        }]
                    }
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
export const joinRoomController = asyncHandler(async(req,res,next)=>{
    const psdata = CreateRoomSchema.safeParse(req.body)
    if(!psdata.success){
        next(new ApiError(400,psdata.error.message||"Fill the fields correctly"))
        return;
    }
    const userId = req.userId
    if(typeof userId === undefined || !userId){
        next(new ApiError(400,"Unauthorized"));
        return
    }
    const slug = psdata.data.slug

    try {
        const found = await prismaClient.room.findUnique({
            where:{
                slug:slug
            }
        })
        if(!found){
            next(new ApiError(400,"Could not find room"));
            return
        }
        const newentry = await prismaClient.userOnRoom.create({
            data:{
                userId:userId,
                roomId:found.id
            }
        })
        console.log(newentry);
        res.json(new apiResponse(200,{slug,roomId:newentry.roomId},"joined room successfully"))
    } catch (error) {
        console.log("Not able to join the room")
        next(new ApiError(500,"Not able to join a room"))
    }

})
export const leaveRoomController = asyncHandler(async(req,res,next)=>{
    const userId = req.userId
    if(!userId){
        next(new ApiError(400,"Unauthorized"));
        return
    }
    let {roomId} = req.body
    if(!roomId){
        next(new ApiError(400,"No room Id"));
        return
    }
    try {
        roomId = parseInt(roomId)
        const findUserRoom = await prismaClient.userOnRoom.delete({
            where:{
                roomId_userId:{
                    roomId:roomId,
                    userId:userId
                }
            }
        })
        const usersInRoom = await prismaClient.userOnRoom.findMany({
            where:{
                roomId:roomId
            }
        })
        if(usersInRoom.length === 0){
            const usersInRoom = await prismaClient.room.delete({
                where:{
                    id:roomId
                }
            })
        }
        res.status(200).json({
            success: true,
            message: "User has left the room successfully",
        });
    } catch (error) {
        console.log("error in leaveroomcontroller",error);
        next(new ApiError(500,"User not in Room"))
        return
    }

})


module.exports={
    signupController,
    signinController,
    createRoomController,
    leaveRoomController,
    joinRoomController,
    logoutController
}