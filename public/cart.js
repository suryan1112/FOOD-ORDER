
export function setupCartItemsListeners(cart_items) {
    

    cart_items.each((index, element) => {
        let dec_btn = $(element).find('.quantity-btn')[0];
        let inc_btn = $(element).find('.quantity-btn')[1];
        let del_btn = $(element).find('.remove-btn')[0];

        dec_btn.addEventListener('click', () => {
            let num=$('.total-amount #num').html()
            $.ajax({
                method: 'get',
                url: `/cart-specific/${$(element).attr('id')}/decrease`,
                data: $(element).serialize(),
                success: (data) => {
                    $('.total-amount #num').html(num-data.object.item.price)    
                    if (data.removed) $(element).remove();
                    else $(element).find('#quantity').html(data.object.quantity);
                },
                error: (err) => console.log(err)
            });
        });

        inc_btn.addEventListener('click', () => {
            let num=$('.total-amount #num').html()
            $.ajax({
                method: 'get',
                url: `/cart-specific/${$(element).attr('id')}/increase`,
                data: $(element).serialize(),
                success: (data) =>{
                    $('.total-amount #num').html(parseInt(num)  +data.object.item.price)  
                    $(element).find('#quantity').html(data.object.quantity)
                } ,
                error: (err) => console.log(err)
            });
        });

        del_btn.addEventListener('click', () => {
            let num=$('.total-amount #num').html()
            $.ajax({
                method: 'get',
                url: `/cart-specific/${$(element).attr('id')}/remove`,
                success: (data) =>{
                    $('.total-amount #num').html(num-data.object.item.price*data.object.quantity)    
                    $(element).remove()
                },
                error: (err) => console.log(err)
            });
        });
    });
}

// Initial setup
setupCartItemsListeners($('.cart-item'));

