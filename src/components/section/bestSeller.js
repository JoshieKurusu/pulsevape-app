class bestSeller extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const category = this.getAttribute("data-category");
        const file = `/src/assets/data/${ category }.json`;

        this.innerHTML = `
            <section id="product-section" data-category="${ category }" class="product-section">
                <div class="container-fluid">
                    <div class="product-content">
                        <h4 class="product-heading">Best Seller</h4>
                        <div class="product-cards"></div>
                        <button type="button" class="btn shop-btn">
                            Shop Now
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M0.937483 11.0625H20.7918L17.5028 7.7895C17.1358 7.42425 17.1344 6.83067 17.4997 6.46368C17.8649 6.09665 18.4586 6.09529 18.8255 6.4605L23.7242 11.3355C23.7245 11.3358 23.7247 11.3361 23.725 11.3364C24.0911 11.7016 24.0922 12.2971 23.7251 12.6636C23.7248 12.6639 23.7245 12.6642 23.7243 12.6645L18.8256 17.5395C18.4587 17.9047 17.8651 17.9034 17.4998 17.5363C17.1345 17.1693 17.1359 16.5757 17.5029 16.2105L20.7918 12.9375H0.937483C0.419703 12.9375 -1.71661e-05 12.5178 -1.71661e-05 12C-1.71661e-05 11.4822 0.419703 11.0625 0.937483 11.0625Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        `;
        fetch(file)
        .then(response => response.json())
        .then(products => {
            const productCardsContainer = this.querySelector(".product-cards");
            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.className = "card";
                productCard.id = `${ product.id }`;
                productCard.innerHTML = `
                    <img src="${ product.image }" alt="${ product.imageAlt }" />
                    <div class="card-body">
                        <h6 class="product-name">${ product.name }</h6>
                        <p class="product-description">${ product.description }</p>
                        <h6 class="product-price">₱${ product.price }</h6>
                    </div>
                `;
                productCardsContainer.appendChild(productCard);
            });
        })
        .catch(err => console.error(`Error loading ${ category } data:`, err));
    }
}
customElements.define("best-seller", bestSeller);