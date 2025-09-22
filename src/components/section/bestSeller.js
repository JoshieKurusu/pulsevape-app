class bestSellers extends HTMLElement {
    constructor() {
        super();
        this.handleResize = this.renderCards.bind(this); // Bind once
    }
    connectedCallback() {
        const category = this.getAttribute("data-category");
        const file = `/src/assets/data/${ category }.json`;

        // Read card limit from attribute
        this.cardLimit = parseInt(this.getAttribute("data-limit")) || Infinity;

        this.innerHTML = `
            <div class="container-fluid">
                <div class="best-seller-content">
                    <h4 class="best-seller-heading">Best Sellers</h4>
                    <div class="best-seller-cards"></div>
                    <button type="button" class="btn shop-btn">
                        Shop Now
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M0.937483 11.0625H20.7918L17.5028 7.7895C17.1358 7.42425 17.1344 6.83067 17.4997 6.46368C17.8649 6.09665 18.4586 6.09529 18.8255 6.4605L23.7242 11.3355C23.7245 11.3358 23.7247 11.3361 23.725 11.3364C24.0911 11.7016 24.0922 12.2971 23.7251 12.6636C23.7248 12.6639 23.7245 12.6642 23.7243 12.6645L18.8256 17.5395C18.4587 17.9047 17.8651 17.9034 17.4998 17.5363C17.1345 17.1693 17.1359 16.5757 17.5029 16.2105L20.7918 12.9375H0.937483C0.419703 12.9375 -1.71661e-05 12.5178 -1.71661e-05 12C-1.71661e-05 11.4822 0.419703 11.0625 0.937483 11.0625Z" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        fetch(file)
            .then(response => response.json())
            .then(bestSellers => {
                // console.log("Fetched best sellers:", bestSellers);
                this.bestSellersData = bestSellers;
                this.renderCards();
            })
            .catch(err => console.error(`Error loading ${ category } data:`, err));

        window.addEventListener("resize", this.handleResize); // Scoped correctly
    }

    disconnectedCallback() {
        window.removeEventListener("resize", this.handleResize); // Clean up
    }

    renderCards() {
        const bestSellerCardsContainer = this.querySelector(".best-seller-cards");
        // console.log("Rendering cards. Container:", bestSellerCardsContainer);
        // console.log("Best sellers data:", this.bestSellersData);

        if (!bestSellerCardsContainer || !Array.isArray(this.bestSellersData) || this.bestSellersData.length === 0) return;

        const categoryCaps = {
            "mods": { mobile: 8, tablet: 9, desktop: 8 },
            "e-juices": { mobile: 4, tablet: 3, desktop: 4 }
        };

        const getMaxCards = () => {
            const caps = categoryCaps[this.getAttribute("data-category")] || { mobile: 4, tablet: 9, desktop: 8 };
            const width = window.innerWidth;

            if (width <= 767) return Math.min(caps.mobile, this.cardLimit); // Mobile
            if (width >= 992) return Math.min(caps.desktop, this.cardLimit); // Desktop
            return Math.min(caps.tablet, this.cardLimit); // Tablet
        };

        const maxCards = getMaxCards();
        const bestSellersToRender = this.bestSellersData.slice(0, Math.min(maxCards, this.cardLimit, this.bestSellersData.length));

        bestSellerCardsContainer.innerHTML = "";

        bestSellersToRender.forEach(bestSeller => {
            bestSellerCardsContainer.appendChild(this.createBestSellerCard(bestSeller));
        });
    }

    createBestSellerCard(bestSeller) {
        const bestSellerCard = document.createElement("div");
        bestSellerCard.className = "card";
        bestSellerCard.id = `${ bestSeller.id }`;
        bestSellerCard.innerHTML = `
            <img src="${ bestSeller.image }" alt="${ bestSeller.imageAlt }" loading="lazy" />
            <div class="card-body">
                <h6 class="product-name">${ bestSeller.name }</h6>
                <p class="product-description">${ bestSeller.description }</p>
                <h6 class="product-price">₱${ bestSeller.price }</h6>
            </div>
        `;
        return bestSellerCard;
    }
}
customElements.define("best-sellers", bestSellers);