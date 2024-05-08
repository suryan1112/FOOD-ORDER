
import whatsappclient from "../../config/whatsapp.js";
import { valid_mobileNumber } from "../helper.js";

export const order_update_whatsapp_mail = async (order) => {
    let messages = {}; // Change this
    let price = {};
    let Initial_msg='*ORDER :*`'+order._id+'`\n' +
                    "has been updated.🔧\n\n"+
                    "`Qty`    `ITEMS`";

    let TotalPrice=0;
    let user_msg1=Initial_msg;

    for (let Object of order.cart_items) {
        const phone = Object.item.user_id.phone;

        // Initialize each messages[phone] as an empty string
        if (!messages[phone]) messages[phone] = ''; // Add this line
        if (price[phone] == null) price[phone] = 0;
        
        if(Object.availability){
            messages[phone] += `\n  ${Object.quantity}  ${String(Object.quantity).length > 1 ? '' : '  '}    ${Object.item.name}`;
            price[phone] += Object.item.price*Object.quantity;
        }
        else
            messages[phone] += `\n  ~${Object.quantity}  ${String(Object.quantity).length > 1 ? '' : '  '}    ${Object.item.name.trim()}~`;
    }
    for (let phone in messages) {
        user_msg1+=messages[phone];

        messages[phone] = Initial_msg + messages[phone] 
                        +`\n *TOTAL : ${price[phone]}*`;
        
        if(messages[phone].includes('~')){
            const actual_phone=phone
            
            phone='91'+phone.substring(phone.length-10)
            console.log(messages[phone], '\n');
            await whatsappclient.sendMessage(phone + '@c.us', messages[actual_phone]);
    
            console.log('message sent to', phone);
        }
    }
    user_msg1+=`\n *TOTAL : ${order.price}*`

    const phone=await valid_mobileNumber(order.order_details.mobileNumber)
    if(phone){
        await whatsappclient.sendMessage(phone + '@c.us', user_msg1);
    }
};

export const order_modifier=async(mobileNumber,order)=>{
    console.log('modifier 1 is running....++++++++++++++++++++++++');

    await order.populate('cart_items.item.user_id')

    for (let Object of order.cart_items) {
        let phone=Object.item.user_id.phone
        phone=phone.substring(phone.length-10)
  
        if( mobileNumber == phone)
            Object.availability=false
    }
    order.price=0
    for(let cart_item of order.cart_items){
        if(cart_item.availability)
            order.price+=cart_item.item.price*cart_item.quantity
    }
    await order.save()
    await order_update_whatsapp_mail(order)
}
const complete_word=['all','complete','sabhi','sabi','sab']

export const order_modifier2=async(mobileNumber,order,items)=>{
    console.log('modifier 2 is running....-------------------------');

    await order.populate('cart_items.item.user_id')

    for (let Object of order.cart_items) {
        let phone=Object.item.user_id.phone
        phone=phone.substring(phone.length-10)

        if (mobileNumber == phone && items.includes(Object.item.name.toLowerCase().trim()))
            Object.availability = false;   
    }
    if(complete_word.some(word => items.includes(word)))
         return order_modifier(mobileNumber,order)
    
    order.price=0
    for(let cart_item of order.cart_items){
        if(cart_item.availability)
            order.price+=cart_item.item.price*cart_item.quantity
    }
    await order.save()
    await order_update_whatsapp_mail(order)
}







