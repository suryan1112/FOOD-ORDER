const socket=io()
$('#notification-box').hide()

var User_id=$('.avatar').attr('id');
if(User_id) socket.emit('setUserID',User_id)
// console.log(User_id)

function like_notify(item_id,user_id,object){
    socket.emit('like-handeling',object,{userId:user_id,itemId:item_id})
}
function comment_handler(item_id,user_id,object){
    socket.emit('comment-handeling',object,{userId:user_id,itemId:item_id})
}

function item_handler(user,object){
    let item_name="object";

    if(object=='add') item_name = $('#form_handler .form-input').eq(0).val();
    if(object=='remove') item_name=$('.item-info .product-name').eq(0).text().trim();

    console.log('item name initialized:',item_name)
    socket.emit('item-handeling',object,user,item_name)
}
var timeout;
socket.on('notification',(msg)=>{
    if(timeout) clearTimeout(timeout)
    console.log(msg)
    let notify_box=$('#notification-box')
    notify_box.show()

    notify_box.append(`<div class="notification" style="color:${getRandomColor()};margin:10px">${msg}</div>`);
    notify_box.animate({ scrollTop: notify_box.prop('scrollHeight') }, 500);

    timeout=setTimeout(()=>{notify_box.hide()}, 3500);
})

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


