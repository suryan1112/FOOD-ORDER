import whatsappclient, { replied as repliedFunction } from "../config/whatsapp.js";
import items from "../models/items.js";
import orders from "../models/orders.js";
import { abc, def, whatsapp_mailer } from "./helper.js";
import { order_modifier, order_modifier2, order_update_whatsapp_mail } from "./helper/helper2.js";
import { findMatches } from "./helper/string_matching.js";

export const order_pg=async(req,res)=>{
    let User = await def(req.cookies.token);
    let sum=0
    // console.log(User.cart_items)
    for(let obj of User.cart_items){
        sum+=obj.item.price*obj.quantity;   
    }
    const item_s = await items
        .find({})
        .populate("user_id")
        .populate("comments");
    const group = abc(item_s);
    // new Noty({
    //     text:req.flash('success')
    // }).show()
    res.render("orders", { group, User,sum, messege: req.flash("order_placing")});
}
export const orderPlace = async (req, res) => {
    try {
        whatsappclient.off("message_create", (msg)=>console.log(msg));
        const { mobileNumber, deliveryAddress } = req.body;
        
        let User = await def(req.cookies.token);
        await User.populate('cart_items.item')
        await User.populate('cart_items.item.user_id')

        if (User.cart_items.length<=0) {
            // If message not sent, redirect back
            req.flash('order_placing', 'CART IS EMPTY 🛒')
            return res.redirect('/orders');
        }
        await whatsapp_mailer(User, mobileNumber, deliveryAddress);

        let order=await orders.create({
            user_id:User._id,         
            order_details:{
                mobileNumber,
                deliveryAddress
            },
            cart_items: User.cart_items,
        });
        var sum=0
        var items_name=[]
        for (let i of order.cart_items){
            sum+=i.item.price*i.quantity;
            items_name.push(i.item.name)
        }
        order.price=sum
        order.save()
        const IDs=order._id

        const cancelation_word=['cancel','nhi','sorry','not','stock','available']
        
        whatsappclient.on("message_create", async(msg )=> {
            const lowerCaseBody = msg.body.toLowerCase();
            let order=await orders.findById(IDs)
            let replied = repliedFunction;
            
            if(order.category=='pending'){
                
                if(lowerCaseBody.includes('cancel')){
                    if( !lowerCaseBody.includes('sieren goupa') )
                        await order_modifier2(msg.from.substring(2,12),order,lowerCaseBody)
                }
                if (replied == msg.from) {
    
                    if (lowerCaseBody === 'interested') {
                        msg.reply('ThankYou for considering our partnership!');
                        replied = NaN;
                    } 
                    else if (lowerCaseBody === 'not interested') {
                        msg.reply('Okay, Thank you. Have a good day 😊');
                        await order_modifier(msg.from.substring(2,12),order)
                        replied = NaN;
                    }
                }
            }
        });

        User.prev_items.push(order.id);
        User.cart_items=[]
        await User.save()

        req.flash('order_placing', 'ORDER PLACED ✅ successfully')
        res.redirect("/about");
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const order_updation=async(req,res)=>{
    try{
        let User = await def(req.cookies.token);
        const ids=req.body.categories
        
        let order = await orders.findByIdAndUpdate(
            req.params.id, // the id of the document
            { $set: { "cart_items.$[elem].availability": false } },
            {
                new: true, // to return the updated document
                arrayFilters: [{ "elem._id": { $in: ids } }] // filter for the elements to update
            }
        );
        await order.populate('cart_items.item.user_id')
        
        order.price=0
        for(let cart_item of order.cart_items){
            if(cart_item.availability)
                order.price+=cart_item.item.price*cart_item.quantity
        }
        await order.save()

        await order_update_whatsapp_mail(order)
        res.redirect('back')
    } catch (error) {
        console.error("Error in updation order list:", error);
        res.status(500).send("Internal Server Error");
    }
}

