import comments from "../models/comments.js";
import items from "../models/items.js";
import user from "../models/users.js";
import { isValidObjectId } from "mongoose";
import fs from 'fs'
import path from "path";
import sub_comments from "../models/sub_comments.js";
import { abc, def, min_validation } from "./helper.js";

export const item = async (req, res) => {
    try {
        let User = await def(req.cookies.token);

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid ObjectId format",
            });
        }
        const reproduce = await items
            .findById(req.params.id)
            .populate("comments");
        const product = await reproduce.populate("comments.user_id")
        let avgRating = 0;
        if (product.comments.length) {
            avgRating =
                product.comments.reduce(
                    (sum, comment) => sum + comment.rating,
                    0
                ) / product.comments.length;
        }
        // product.rating = Math.round(avgRating);
        product.rating = avgRating;
        await product.save();
        await product.populate('likes');
        await product.populate('user_id');
        await product.populate("comments.likes");
        await product.populate("comments.sub_comments")
        await product.populate("comments.sub_comments.user_id")
        await product.populate("comments.sub_comments.likes")
        
        const cls=product.class
        let item=await items.find({class:cls})
        
        const group = abc(item);
        return res.render("item", { product, User, group,cls });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
export const add_item = async (req, res) => {
    let img_arr=[]
    let User = await def(req.cookies.token);

    req.files.forEach(elemet=>img_arr.push(`/uploads/material/${elemet.filename}`))
    if(img_arr) req.body.material=img_arr
    
    req.body.user_id=User.id
    console.log(req.body);

    if(!min_validation(User.phone)){
        req.flash('order_placing', `Enter valid mobile number`)
        return res.redirect("/about");
    }
    //enter the correct mobile number
    const item = await items.create(req.body);
    
    if (req.xhr) {
        return res.status(200).json({
            item_d: item,
            messege: "item added succesfully",
        });
    }
    res.redirect("back");
};
export const update_item=async(req,res)=>{
    try {
    let object=req.body
    for(let x in object ){
        if(object[x]) continue
        else delete object[x]
    }
    const item=await items.findByIdAndUpdate(req.params.id,object)
    
    let categories=req.body.categories
    if(typeof(categories)=='string'){categories=[categories,]}
    
    if(categories) 
        for(let x of categories){
            const img_path=path.join(path.resolve(),'public',x);
            if(fs.existsSync(img_path)) fs.unlinkSync(img_path)
            await items.findByIdAndUpdate(req.params.id,{$pull:{material:x}})
        }
    req.files.forEach(elemet=>item.material.push(`/uploads/material/${elemet.filename}`))
    
    
    // await items.save();
    res.redirect('back')
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server erroro",
        });
    }
    
}
export const remove_item = async (req, res) => {
    try {
        await comments.deleteMany({ item_id: req.params.id });
        const item = await items.findById(req.params.id)
        let cls=item.class
        if(!item.class || item.class=="food") {cls=''}

        for(let comment_ID of item.comments)
            await sub_comments.deleteMany({parent_comment_id:comment_ID})
        for(let x of item.material){
            const img_path=path.join(path.resolve(),'public',x);
            if(fs.existsSync(img_path)) fs.unlinkSync(img_path)
        }
        await user.updateMany(
            {},
            { $pull: { cart_items: { item: req.params.id } } }
        );
        await items.deleteOne({ _id: req.params.id });

        res.redirect(`/${cls}`)
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            messege: "internal server error",
        });
    }
};