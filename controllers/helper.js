import user from "../models/users.js";
import jwt from "jsonwebtoken";
import whatsappclient from "../config/whatsapp.js";

const whatsapp_mailer = async (User, mobileNumber, deliveryAddress) => {
    let messages = {};
    let price = {};

    let phitms = {};

    for (let Object of User.cart_items) {
        const phone = Object.item.user_id.phone;

        if (messages[phone] == null) {
            messages[phone] = `🧑‍💻 *Order placed by*: ${User.name} \n` +
                `📞 *Phone number*: ${mobileNumber} \n\n`;
            messages[phone] += "`Qty`    `ITEMS`";
        }
        messages[phone] += `\n  ${Object.quantity}  ${String(Object.quantity).length > 1 ? '' : '  '}    ${Object.item.name}`;

        if (price[phone] == null) price[phone] = 0;
        price[phone] += Object.item.price;

        if (!phitms[phone]) phitms[phone] = [];
        phitms[phone].push(Object.item.name);
    }

    let correct_numbers = [];
    const phoneRegex = /^\d{12}$/;
    let actual_send_items = [];

    for (let phone in messages) {
        messages[phone] += `\n *TOTAL : ${price[phone]}*`;
        messages[phone] += `\n\n🌏 *Location* :${deliveryAddress}`;

        const actual_phone=phone
        if (phone.length == 10) phone = '91' + phone;

        if (phoneRegex.test(phone) && await whatsappclient.isRegisteredUser(phone + '@c.us')) {
            await whatsappclient.sendMessage(phone + '@c.us', messages[actual_phone]);
            correct_numbers.push(actual_phone)
            actual_send_items.push(...phitms[actual_phone]);
        }
        else continue

        console.log('message sent to', phone);
        console.log(messages[phone], '\n');
    }
    let user_msg;
    if (correct_numbers.length === Object.keys(messages).length)
        user_msg = `All ${User.cart_items.length} items have been dispatched ✅`;
    else if (correct_numbers.length === 0)
        user_msg = 'No items have been authorized ❌ \n`sorry`';
    else
        user_msg = `Only ${actual_send_items.join(',')} have been dispatched ☑️.\n ~Few Sellers are Unauthorized~`;

    let phone=mobileNumber
    if (phone.length == 10) phone = '91' + phone;

    if (phoneRegex.test(phone) && await whatsappclient.isRegisteredUser(phone + '@c.us'))
        await whatsappclient.sendMessage(phone + '@c.us', user_msg);

    return correct_numbers;
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
export { whatsapp_mailer, abc, abc2, def };



export const whatsapp_action_handeler = async (order, action) => {
    let phone_arr = [];

    for (let Object of order.cart_items) {
        const phone = Object.item.user_id.phone;
        if (!phone_arr.includes(phone)) {
            phone_arr.push(phone);
        }
    }

    const phoneRegex = /^\d{12}$/;
    let msg = '*ID :*`'+order._id+'`' + `\n*TOTAL : ${order.price}*\n`;

    for (let phone of phone_arr) {

        if(action=='cancelled') msg+=`${order.user_id.name} has cancelled the order 🎟️`
        else msg+=`${order.user_id.name} has finished the order 🎫}`

        if(order.rating) msg+='\n\nRating : '+order.rating
        if(order.experience) msg+='\nfeedback : '+order.experience

        if (phone.length == 10) phone = '91' + phone;
        if (phoneRegex.test(phone) && await whatsappclient.isRegisteredUser(phone + '@c.us'))
            await whatsappclient.sendMessage(phone + '@c.us', msg );
        
    }
    let phone=order.user_id.phone
    if (phone.length == 10) phone = '91' + phone;

    if (phoneRegex.test(phone) && await whatsappclient.isRegisteredUser(phone + '@c.us'))
        await whatsappclient.sendMessage(phone + '@c.us', `you *${(action === 'cancelled') ? action : 'finished'}* the order: *${order._id}*👍`);
    
};

