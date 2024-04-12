import mongoose from 'mongoose'

const schema=new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    category:{
        type:String,
        default:'pending'
    },
    price:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:0
    },
    experience:String,
    order_details:{
        mobileNumber:{
            type:String,
            required:true,
        },
        deliveryAddress:{
            type:String,
            required:true
        } 
    },
    cart_items:[{
        item: mongoose.Schema.Types.Mixed,
        quantity: {
            type: Number,
            default: 1, // You can set a default value if needed
        },
        availability:{
            type:Boolean,
            default:true
        }
    }]
},{
    timestamps:true
})

const orders=mongoose.model('orders',schema)

export default orders;

