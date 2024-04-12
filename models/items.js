import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const MATERIAL_PATH=path.join('public/uploads/material')

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    specification:{
        type:String,
        required:false
    },
    category:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:false,
        default:0
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comments',
        // required:true
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'likes',
    }],
    material:[{
        type:String,
        required:true
    }]
},{
    timestamps:true
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(path.resolve(), MATERIAL_PATH);
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
export const upload =multer({storage:storage}).array('material',5);

const items=mongoose.model('items',schema)

export default items;

