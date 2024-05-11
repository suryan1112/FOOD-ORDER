
import whatsappclient from "../../config/whatsapp.js";
import orders from "../../models/orders.js";
import { valid_mobileNumber } from "../helper.js";
import { generateRandomLengthOTP } from "./string_matching.js";

export const order_update_whatsapp_mail = async (order) => {
    let messages = {}; // Change this
    let price = {};
    let Initial_msg='*ID :*`'+order._id+'`\n' +
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

export const make_order_modification=async(order)=>{
    try {
        const IDs=order.id

        const cancelation_word=['cancel','nhi','sorry','not','stock','available']
        const regex = /\*ID :\*([^\n]+)/;

        whatsappclient.on("message_create", async(msg )=> {
            const lowerCaseBody = msg.body.toLowerCase();
            const quoted = msg._data.quotedMsg;
            let id ='**************'

            if (quoted){ 
                const orderDetails = quoted.body ;
                if(orderDetails.substr(0,3)=='*ID'){
                    const match = orderDetails.match(regex);
                    id= match ? match[1] : null;
                    id = id.replace(/[^\w]/g, '');                    
                    }
            }
            let order=await orders.findById(IDs)
            
            if(order.category=='pending' && (!quoted || id==IDs) ){

                if(lowerCaseBody.includes('cancel')){
                    if( !lowerCaseBody.includes('sieren goupa') )
                        await order_modifier2(msg.from.substring(2,12),order,lowerCaseBody)
                }
                if (global.replied == msg.from) {
    
                    if (lowerCaseBody === 'interested') {
                        msg.reply('ThankYou for considering our partnership!');
                        global.replied = NaN;
                    } 
                    else if (lowerCaseBody === 'not interested') {
                        // msg.reply('Okay, Thank you. Have a good day 😊');
                        await order_modifier(msg.from.substring(2,12),order)
                        global.replied = NaN;
                    }
                }
            }
        });        
        global.make_order=true

    } catch (error) {
        console.error("Error in making whatsapp' order modification:", error);
        res.status(500).send("Internal Server Error");
    }
}

export const order_modifier=async(mobileNumber,order)=>{
    console.log('modifier 1 is running....++++++++++++++++++++++++');

    await order.populate('cart_items.item.user_id')
    let already_cancelled=true

    for (let Object of order.cart_items) {
        let phone=Object.item.user_id.phone
        phone=phone.substring(phone.length-10)
  
        if( mobileNumber == phone)
            if(Object.availability) already_cancelled=false
            Object.availability=false
    }
    if(already_cancelled){
        const userMsg = '*ID :*`'+order._id+'`\n'+"order has been already cancilled 👍";  
        await whatsappclient.sendMessage('91'+mobileNumber.substring(mobileNumber.length-10)+ '@c.us', userMsg);
        return;
    }
    for(let cart_item of order.cart_items){
        if(!cart_item.availability)
            order.price-=cart_item.item.price*cart_item.quantity
    }
    await order.save()
    await order_update_whatsapp_mail(order)
}
const complete_word=['all','complete','sabhi','sabi','sab']

export const order_modifier2=async(mobileNumber,order,items)=>{
    console.log('modifier 2 is running....-------------------------');

    await order.populate('cart_items.item.user_id')
    let item_count=0
    let already_cancelled=true

    for (let Object of order.cart_items) {
        let phone=Object.item.user_id.phone
        phone=phone.substring(phone.length-10)

        if (mobileNumber == phone && items.includes(Object.item.name.toLowerCase().trim())){
            if(Object.availability) already_cancelled=false
            Object.availability = false;
        }
        if(mobileNumber!=phone) item_count++;
    }
    if(item_count==order.cart_items.length){
        const userMsg = "Please update the order using our application 🙏";  
        await whatsappclient.sendMessage('91'+mobileNumber.substring(mobileNumber.length-10)+ '@c.us', userMsg);
        return;
    }
    if(complete_word.some(word => items.includes(word)))
         return order_modifier(mobileNumber,order)

    if(already_cancelled){
        const userMsg = '*ID :*`'+order._id+'`\n'+"These items are already cancilled 👍";  
        await whatsappclient.sendMessage('91'+mobileNumber.substring(mobileNumber.length-10)+ '@c.us', userMsg);
        return;
    }    
    for(let cart_item of order.cart_items){
        if(!cart_item.availability)
            order.price-=cart_item.item.price*cart_item.quantity
    }
    await order.save()
    await order_update_whatsapp_mail(order)
}


export const otp_sender=async(mobileNumber)=>{
    const otp=generateRandomLengthOTP()
    const otp_msg='your *Dark Web* OTP is `'+otp+"`\n~_Don't share it with any one_";
    
    const phone=await valid_mobileNumber(mobileNumber)
    if(phone){
        await whatsappclient.sendMessage(phone + '@c.us', otp_msg);
        return otp;
    }
    return false;
}






