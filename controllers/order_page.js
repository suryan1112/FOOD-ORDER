import items from "../models/items.js";
import orders from "../models/orders.js";
import { abc, def, whatsapp_mailer } from "./helper.js";

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
        const { mobileNumber, deliveryAddress } = req.body;
        
        let User = await def(req.cookies.token);
        await User.populate('cart_items.item')
        await User.populate('cart_items.item.user_id')

        if (User.cart_items.length<=0) {
            // If message not sent, redirect back
            req.flash('order_placing', 'CART IS EMPTY 🛒')
            return res.redirect('/orders');
        }
        const correct_numbers= await whatsapp_mailer(User, mobileNumber, deliveryAddress);

        if(correct_numbers.length===0){
            req.flash('order_placing', "these items are unauthorized 📵")
            return res.redirect('/orders');
        }
        const order=await orders.create({
            user_id:User._id,         
            order_details:{
                mobileNumber,
                deliveryAddress
            },
            cart_items: User.cart_items,
        });
        var sum=0
        for (let i of order.cart_items){
            sum+=i.item.price*i.quantity;
        }
        order.price=sum
        order.save()

        User.prev_items.push(order.id);
        User.cart_items=[]
        User.save()

        req.flash('order_placing', 'ORDER PLACED ✅ successfully')
        res.redirect("/about");
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send("Internal Server Error");
    }
};