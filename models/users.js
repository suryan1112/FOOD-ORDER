import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const AVATAR_PATH=path.join('public/uploads/users')

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        default:'000-000-000-0'
    },
    quote:{
        type:String,
        default:'******************'
    },
    address:{
        type:String,
        default:'M-block,iet davv, indore,M.P'
    },
    About:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    cart_items:[{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'items',
            // required: true
        },
        quantity: {
            type: Number,
            default: 1, // You can set a default value if needed
        },
        availability:{
            type:Boolean,
            default:true
        }
    }],
    prev_items:[{
        order_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orders',
        }
    }],
    avatar:{
        type:String,
        default:'uploads/fixed_images/downloaded.png'
    }
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
export const upload =multer({storage:storage}).single('avatar');

const user=mongoose.model('users',schema)

export default user;

