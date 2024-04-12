import mongoose from 'mongoose'

const schema=new mongoose.Schema({
   parent_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
    },
    object_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'object_name',
    },
    object_name: {
        type: String,
        required: true,
        enum: ['items', 'sub_comments', 'comments'],
    },
},{
    timestamps:true
})

const likes=mongoose.model('likes',schema)

export default likes;

