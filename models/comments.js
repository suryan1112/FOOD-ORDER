import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const AVATAR_PATH=path.join('public/uploads/comments')

const schema=new mongoose.Schema({
    rating:{
        type:Number,
        required:true
    },
    content:{
        type:String,
        // required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    item_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'items',
        required:true
    }, 
    image_url:[{
        type:String,
        required:true
    }  ],
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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(path.resolve(), AVATAR_PATH);
        // Create the destination directory if it doesn't exist
        fs.mkdirSync(destinationPath, { recursive: true });
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix+'.png')
    }
});

//static folers
// export const upload2 =multer({storage:storage}).fields([{name:'commentImage',maxCount:10}])
export const upload2 =multer({storage:storage}).array('commentImage',10)


const comments=mongoose.model('comments',schema)

export default comments;

