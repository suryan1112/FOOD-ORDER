import user from "../models/users.js";
import jwt from "jsonwebtoken";
import whatsappclient from "../config/whatsapp.js";

const whatsapp_mailer = async (User, mobileNumber, deliveryAddress) => {
    let messages = {}; // Change this
    let price = {};
    let Initial_msg=`🧑‍💻 *Order placed by*: ${User.name} \n` +
                    `📞 *Phone number*: ${mobileNumber} \n\n`+
                    "`Qty`    `ITEMS`";
    let TotalPrice=0;
    let user_msg1=Initial_msg;

    for (let Object of User.cart_items) {
        const phone = Object.item.user_id.phone;

        // Initialize each messages[phone] as an empty string
        if (!messages[phone]) messages[phone] = ''; // Add this line

        messages[phone] += `\n  ${Object.quantity}  ${String(Object.quantity).length > 1 ? '' : '  '}    ${Object.item.name}`;

        if (price[phone] == null) price[phone] = 0;
        price[phone] += Object.item.price*Object.quantity;
    }
    for (let phone in messages) {
        user_msg1+=messages[phone]
        TotalPrice+=price[phone]

        messages[phone] = Initial_msg + messages[phone] 
                        +`\n *TOTAL : ${price[phone]}*`
                        +`\n\n🌏 *Location* :${deliveryAddress}`;

        const actual_phone=phone
        
        phone='91'+phone.substring(phone.length-10)
        await whatsappclient.sendMessage(phone + '@c.us', messages[actual_phone]);

        console.log('message sent to', phone);
        console.log(messages[phone], '\n');
    }
    user_msg1+=`\n *TOTAL : ${TotalPrice}*`+`\n\n🌏 *Location* :${deliveryAddress}`
    let user_msg2= `All ${User.cart_items.length} items have been dispatched ✅`;

    const phone=await valid_mobileNumber(mobileNumber)
    if(phone){
        await whatsappclient.sendMessage(phone + '@c.us', user_msg1);
        await whatsappclient.sendMessage(phone + '@c.us', user_msg2);
    }
};



function abc(item_s) {
    let group = {};
    item_s.forEach((item) => {
        if (group[item.category]) group[item.category].push(item);
        else group[item.category] = [item];
    });
    for (let grp in group)
        group[grp].sort((a, b) => a.name.localeCompare(b.name));

    return group;
}
function abc2(item_s) {
    let group = {}
    item_s.forEach((item) => {
        if (group[item.category]) group[item.category].push(item);
        else group[item.category] = [item];
    });
    return group;
}
async function def(token) {
    let User = null;
    if (token) {
        const decoded_token = jwt.decode(token);
        if (decoded_token)
            User = await user
                .findById(decoded_token._id)
                .populate("cart_items.item");
    }
    return User;
}
function shuffleObject(obj) {
    // Get the keys of the object
    var keys = Object.keys(obj);

    // Shuffle the keys randomly
    for (var i = keys.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = keys[i];
        keys[i] = keys[j];
        keys[j] = temp;
    }

    // Create a new object with shuffled keys
    var shuffledObject = {};
    keys.forEach(function(key) {
        shuffledObject[key] = obj[key];
    });

    return shuffledObject;
}
export { whatsapp_mailer, abc, abc2, def,shuffleObject };



export const whatsapp_action_handeler = async (order, action) => {
    let phone_arr = [];

    for (let Object of order.cart_items) {
        const phone = Object.item.user_id.phone;
        if (!phone_arr.includes(phone)) {
            phone_arr.push(phone);
        }
    }
    let original_msg = '*ID :*`'+order._id+'`' + `\n*TOTAL : ${order.price}*\n`;
    console.log(phone_arr)
    for (let phone of phone_arr) {
        let msg=original_msg

        if(action=='cancelled') msg+=`${order.user_id.name} has cancelled the order 🎟️`
        else msg+=`${order.user_id.name} has finished the order 🎫`

        if(order.rating) msg+=`\n\nRating : *${order.rating}*⭐`
        if(order.experience) msg+=`\nfeedback : _${order.experience}_`

        phone='91'+phone.substring(phone.length-10)
        await whatsappclient.sendMessage(phone + '@c.us', msg);
        
    }
    let phone=order.user_id.phone
    phone='91'+phone.substring(phone.length-10)

    await whatsappclient.sendMessage(phone + '@c.us',
         `you *${(action === 'cancelled') ? action : 'finished'}* the order: *${order._id}*👍`);
    
};

export const valid_mobileNumber=async (phone)=>{
    const phoneRegex = /^\d{12}$/;
    phone='91'+phone.substring(phone.length-10)
    
    if (phoneRegex.test(phone) && await whatsappclient.isRegisteredUser(phone + '@c.us')){
        console.log(`phone number ${phone} is valid`);
        return phone;
    }
    console.log(`phone number ${phone} is not valid`);
    return false;
}
export const min_validation=(phone)=>{
    const phoneRegex = /^\d{12}$/;
    phone='91'+phone.substring(phone.length-10)

    return phoneRegex.test(phone)
}