// ADDING COMMA IF PRICE IS IN THOUSAND
export function formatPrice(price) {
    const num = Number(price);
    return isNaN(num) ? "₱0.00" : num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function createProductCard({ id, image, imageAlt, name, description, price }) {
    const productCard = document.createElement("div");
    productCard.className = "card";
    productCard.id = id;
    productCard.dataset.price = price;
    productCard.innerHTML = `
        <img src="${ image }" alt="${ imageAlt }" loading="lazy"/>
        <div class="card-body">
            <h6 class="product-name">${ name }</h6>
            <p class="product-description">${ description }</p>
            <h6 class="product-price">₱${ formatPrice(price) }</h6>
        </div>
    `;
    return productCard;
}