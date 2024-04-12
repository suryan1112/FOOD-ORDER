import comments from "../models/comments.js";
import items from "../models/items.js";
import user from "../models/users.js";
import sub_comments from "../models/sub_comments.js";
import likes from "../models/likes.js";


export const likes_handler=async(req,res)=>{
    try {
        // likes/?id=aoiuwlerj&model=items;
        const User=await user.findById(req.user._id)
        const {id,object}=req.params
        const model=object;
        let removed=false

        let like=await likes.findOne({
            parent_id:User.id,
            object_id:id,
            object_name:object
        })
        if(like){
            await likes.findByIdAndDelete(like.id)
            removed=true
            if(model=='items')
                await items.findByIdAndUpdate(id,{ $pull: { likes: like.id} })
            if(model=='comments')
                await comments.findByIdAndUpdate(id,{ $pull: { likes: like.id} })
            if(model=='sub_comments')
                await sub_comments.findByIdAndUpdate(id,{ $pull: { likes: like.id} })
        }
        else{
            like=await likes.create({
                parent_id:User.id,
                object_id:id,
                object_name:object
            })
            console.log('like is been created')
            if(model=='items')
                await items.findByIdAndUpdate(id,{ $push: { likes: like.id} },{ new: true })
            if(model=='comments')
                await comments.findByIdAndUpdate(id,{ $push: { likes: like.id} },{ new: true })
            if(model=='sub_comments')
                await sub_comments.findByIdAndUpdate(id,{ $push: { likes: like.id} },{ new: true })
        }
        await like.populate('object_id')

        if (req.xhr) {
            return res.status(200).json({
                count:like.object_id.likes.length,
                removed,
                messege: "like updated_succesfully",
            });
        }
        res.status(202).json({
            messege:'like updated_succesfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            messege: "internal server error in likes handeling",
        });
    }
}