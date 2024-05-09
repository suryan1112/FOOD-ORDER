import jwt from "jsonwebtoken";
import user from "../models/users.js"
import bcrypt from "bcrypt";
import { def } from "../controllers/helper.js";
import { otp_sender } from "../controllers/helper/helper2.js";

export const isAuthenticated=async(req,res,next)=>{
    const {token}=req.cookies
    if(token){
        const decoded_token= jwt.decode(token)
        if(decoded_token){
            req.user=await user.findById(decoded_token._id)
            return next();}
    }
    res.render('forms/user_sign_in')
}

export const want_sign_in=(req,res)=>res.render('forms/user_sign_in');

export const want_sign_up=(req,res)=>res.render('forms/user_sign_up');

export const want_update_user=(req,res)=>res.render('forms/user_update',{User:req.user})

export const sub_Authenticated=async(req,res,next)=>{
    const {token,sub_token}=req.cookies

    if(sub_token){
        if(req.user.token==sub_token){
            return next();}
    }
    if(!req.user.token) {
        req.user.token=token;
        await req.user.save()
    }
    res.render('forms/token_reg')
}
export var OTP='0000'
export const otp_Authenticated=async(req,res,next)=>{
    const {otp_token}=req.cookies

    if(otp_token){
        const validation = await bcrypt.compare(
            otp_token,
            req.user.password
        );
            return next();
    }
    OTP=await otp_sender(req.user.phone)

    if(OTP) return res.render('forms/otp_reg');

    res.render('forms/user_update',{
        User:req.user,
        messege:'mobile number is incorrect'
    })
}