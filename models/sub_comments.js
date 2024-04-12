import mongoose from 'mongoose'

const schema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    parent_comment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comments',
    }, 
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'likes',
    }],
    sub_comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'sub_comments',
        required:true
    }]
},{
    timestamps:true
})

const sub_comments=mongoose.model('sub_comments',schema)

export default sub_comments;

