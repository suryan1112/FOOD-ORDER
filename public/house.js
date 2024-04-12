let form = document.getElementById('form_handler');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('form submitted');
    
    $.ajax({
        method: 'post',
        url: '/add_item',
        data: $(form).serialize(),
        success: (data) => { 
            const item=data.item_d
            const component = document.getElementById(item.category);
            const newItem = create_item(item)[0];
            component.append(newItem);
        },
        error: (err) => console.log(err)
    });
});
    
const create_item = (item) => {
    return $(`
        <div class="product-card" id="${item._id}">
            <img class="product-pic" src="product1.jpg" alt="Product 1" />
            <div class="product-name">${item.name}</div>
            <div class="product-price">$${item.price}</div>
            <div class="product-description">${item.description}</div>
            <div class="rating" id="product-rating-${item.id}">
                ${Array.from({ length: item.rating }, (_, index) => `<span> ★</span>`).join('')}
                ${Array.from({ length: 5 - item.rating }, (_, index) => `<span> ☆</span>`).join('')}
            </div>
               <button class="add-to-cart-btn" type="submit">Add to Cart</button>
            <a href="/${item.id}">
                <button class="view-btn">View</button>
            </a>
        </div>
    `);
};
