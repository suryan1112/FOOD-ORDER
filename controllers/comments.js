import comments from "../models/comments.js";
import items from "../models/items.js";
import fs from 'fs'
import path from "path";
import sub_comments from "../models/sub_comments.js";

export const add_comment = async (req, res) => {
    console.log(req.body);
    const { content, rating } = req.body;
    let img_arr=[];
    req.files.forEach(elemet=>img_arr.push(`/uploads/comments/${elemet.filename}`))
    const comment = await comments.create({
        content,
        rating,
        user_id: req.user._id,
        // items_id: req.params.id,
        item_id: req.params.id,
        image_url:img_arr,
    });

    const item = await items.findById(req.params.id);
    
    item.comments.push(comment._id);

    // comment.user_id=req.user
    // newComment(comment);

    await item.save();
    // res.status(200).json({
    //     messege:'comment done'
    // })
    return res.redirect("back");

    if (req.xhr) {
        return res.status(200).json(comment);
    }
    res.status(202).json({
        messege:'like updated_succesfully'
    })
};
export const remove_comment = async (req, res) => {
    try {
        const comment = await comments.findById(req.params.id);
        
        const subComment=await sub_comments.findById(req.params.id);
        if(subComment){
            await sub_comments.deleteOne({_id:req.params.id})
            return res.redirect('back');
        }

        for(let x of comment.image_url){
        const img_path=path.join(path.resolve(),'public',x);
        if(fs.existsSync(img_path)) fs.unlinkSync(img_path)
        }

        await items.findByIdAndUpdate(comment.item_id, {
            $pull: { comments: comment._id },
        });
        await sub_comments.deleteMany({parent_comment_id:comment._id})
        await comments.deleteOne({_id:comment.id})
        console.log(comment._id)
        res.redirect("back");
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            messege: "internal server error",
        });
    }
};
export const subComment=async(req,res)=>{
    try {
        const {sub_comment}=req.body
        console.log('hellow')
        const comment=await sub_comments.create({
            content:sub_comment,
            user_id:req.user._id,
            parent_comment_id:req.params.id,
        })

        const parentComment = await (await (sub_comments.findById(req.params.id)) ? 
            sub_comments.findById(req.params.id) :
            comments.findById(req.params.id)).exec();

        parentComment.sub_comments.push(comment.id)
        parentComment.save();

        res.redirect("back");
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send("Internal Server Error");       
    }
}
