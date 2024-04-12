import orders from "../models/orders.js";
import { abc2, def, whatsapp_action_handeler } from "./helper.js";

export const about_pg=async(req,res)=>{
    let User = await def(req.cookies.token);
  
    const order_s=await orders.find({user_id:req.user._id})
    
    const group = abc2(order_s);
    const latestOrder = order_s.sort((a, b) => b.updatedAt - a.updatedAt)[0];

    res.render("about", { group, User,latestOrder, messege: req.flash("order_placing")});
}  
export const update_orders=async(req,res)=>{
    const {action,rating,content}=req.body;
    
    var objecti={}
    if(rating) objecti.rating=rating;
    if(content) objecti.experience=content;
    
    objecti.category=action
    
    let order=await orders.findByIdAndUpdate(req.params.id,objecti, { new: true })
    await order.populate('cart_items.item.user_id')
    await order.populate('user_id')
    
    whatsapp_action_handeler(order,action);
    
    req.flash('order_placing', `order is ${action}`)
    res.redirect('back')
} 
export const about_pg_sorted = async (req, res) => {
    try {
        let User = await def(req.cookies.token);

        const { categories, min_price, max_price, sort } = req.body;

        const query = {
            category: categories,
            price: { $gte: min_price, $lte: max_price },
        };

        const sortObject = {};
        if(sort==='rating'){sortObject[sort]=-1}
        else sortObject[sort]=1;

        var order_s
        if(sort){
            order_s = await orders
            .find({user_id:User.id})
            .find(query)
            .populate("user_id")
            .populate('cart_items.item')
            .sort(sortObject)
        }
        else{
            order_s = await orders
            .find({user_id:User.id})
            .find(query)
            .populate("user_id")
            .populate('cart_items.item')
        }
        const group = abc2(order_s);

        const latestOrder = order_s.sort((a, b) => b.updatedAt - a.updatedAt)[0];
        res.render("about", { group,latestOrder, User });
    } catch (error) {
        console.error("Error in home_pg_sorted:", error);
        res.status(500).send("Internal Server Error");
    }
}; //about_pg_sorted