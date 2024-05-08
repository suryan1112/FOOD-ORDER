// import orders from "../models/orders";
const orders=document.getElementsByClassName('show-order')
// console.log(group)
var hidden=true;
const new_cart = async (order) => {
    return `
        <div class="appending">
            <h2>Order_id:</h2>
            <b>(--${order._id}--)</b>
            <div class="cart-inside">
                <form action="/order_updation/${order._id}" method="post">
                    ${order.cart_items.map(obj => `
                        <div class="cart-item" id="${obj.item._id}" 
                        style="${!obj.availability ? 'background:#ffe5e5' : (order.category=='pending')?'':'background:#c1ffc16b'}">
                            ${(obj.availability && order.category=='pending') ? `<input type="checkbox" class="filter-checkbox-update" name="categories" value="${obj._id}" />` : ''}
                            <img src="${obj.item.material[0] || 'uploads/fixed_images/food-logo.png'}" alt="Product 1" />
                            <div class="cart-item-info">
                                <p style="width: 90px">${obj.item.name}</p>
                                <span>₹${obj.item.price}</span>
                            </div>
                            <div class="cart-item-actions">
                                <p style="width: 90px">quantity:</p>
                                <span id="quantity">${obj.quantity}</span>
                            </div>
                        </div>
                    `).join('')}
                    <h2 class="total-amount">
                        <span>---YOUR TOTAL : $ </span>
                        <span id="num">${order.price}</span>---
                    </h2>
                    <button type="submit" style="margin: 20px;">update Order</button>
                </form>
            </div>
        </div>
    `;
}



for (let i of orders) {
    i.addEventListener('click', async () => {
        $('.appending').hide();
        const obj=JSON.parse(i.getAttribute('obj'))
        // console.log(obj)
        $('.cart').append(await new_cart(obj))
    });
}

const btns=$('#pending .cancel-order')
for(let i in btns){
    $.ajax({
        method: 'get',
        url: `/cart-specific/${$(element).attr('id')}/add`,
        data: $(element).serialize(),
        success: (data) => {
            
        },
        error: (err) => console.log(err)
    });
}
function hide_comment(id){
    $(`#${id}`)[0].style.display='none'
}
// btns=$('.exit')
// for(let i of btns){
//     i.addEventListener('click',()=>{
//         i.getAttribute('id')
//     })
// }
function setAction(action,id) {
    $(`#${id}`)[0].style.display='flex'
    // console.log(action)
    document.getElementById(`actionInput/${id}`).value = action;
}
function hide_show(){
    if(hidden)
        $('.delete-user')[0].style.display='block'
    else   
    $('.delete-user')[0].style.display='none' 
    hidden=!hidden;
}
