import jwt from "jsonwebtoken";
import user from "../models/users.js"

export const isAuthenticated=async(req,res,next)=>{
    const {token}=req.cookies
    if(token){
        const decoded_token= jwt.decode(token)
        if(decoded_token){
            req.user=await user.findById(decoded_token._id)
            return next();}
    }
    res.render('user_sign_in')
}

export const want_sign_in=(req,res)=>res.render('user_sign_in');

export const want_sign_up=(req,res)=>res.render('user_sign_up');

export const want_update_user=(req,res)=>res.render('user_update',{User:req.user})

export const sub_Authenticated=async(req,res,next)=>{
    const {token,sub_token}=req.cookies
    if(sub_token){
        if(token==sub_token){
            return next();}
    }
    res.render('token_reg')
}