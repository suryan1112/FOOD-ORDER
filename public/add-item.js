import {setupCartItemsListeners} from './cart.js'

let add_item = $('.product-card');

const new_cart_item=(item)=>{
    return $(`
        <div class="cart-item" id="${ item._id }">
            <img src="${item.material}" alt="Product 1">
            <div class="cart-item-info">
                <p>${ item.name }</p>
                <span>₹${ item.price }</span>
            </div>
            <div class="cart-item-actions">

                <button class="quantity-btn">-</button>
                    <span id="quantity">1</span>
                <button class="quantity-btn">+</button>

                <button class="remove-btn" id="remove">X</button>
            </div>
        </div>
    `)
}
function handleAddToCart(element) {
    $.ajax({
        method: 'get',
        url: `/cart-specific/${$(element).attr('id')}/add`,
        data: $(element).serialize(),
        success: (data) => {
            if (data.object) {
                // console.log($(`.cart #${data.object.item._id }`).find('#quantity'))
                $(`.cart #${data.object.item._id}`).find('#quantity').html(data.object.quantity);

                scroll_animation($(`.cart #${data.object.item._id}`))
            } else {
                // console.log('item added succesfully',$(element).attr('style'),$(element).attr('value'))

                const photo=($(element).attr('style'))?$(element).attr('style').match(/url\((['"])(.*?)\1\)/)[2]:$(element).attr('value');
                const item = {
                    name: $(element).find('.product-name').text(),
                    price: parseInt($(element).find('.product-price').text().replace(/\D/g, "")),
                    _id: $(element).attr('id'),
                    material: (photo)?photo:'uploads/fixed_images/food-logo.png'
                };
                $('.cart-inside').append(new_cart_item(item));
                setupCartItemsListeners($('.cart-item')); // Re-setup listeners for new items
                scroll_animation($(`.cart #${item._id}`))
            }
            hovering($('.cart-item'),'hellow')
        },
        error: (err) => console.log(err)
    });
}
function scroll_animation(targetDiv){
    const container=document.getElementsByClassName('cart')[0]
    container.scrollTop=targetDiv[0].offsetTop-300;
    targetDiv.css('background','rgb(171, 171, 171)')
    setTimeout(()=>targetDiv.css('background','#eeeeee'),400)
}

function hovering(cartItems,str) {
    // console.log(cartItems,str)
    cartItems.mouseover(function() {
        // Code to execute when the mouse hovers over the element
        $(this).css({
            'background-color': 'rgb(171, 171, 171) ',
        });
    });

    cartItems.mouseout(function() {
        $(this).css({
            'background-color': '#eeeeee ', // Revert to the original background color or remove this line if not needed
        });
    });
};

hovering($('.cart-item'),'yelllow')

add_item.each((index, element) => {
    let btn = $(element).find('.add-to-cart-btn')[0];
    $(btn).on('click', () => handleAddToCart(element));
});

