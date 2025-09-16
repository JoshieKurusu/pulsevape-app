class ProductCategories extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <section id="category-section" class="category-section">
                <div class="container-fluid">
                    <div class="category-content">
                        <h4 class="category-heading">Product Categories</h4>
                        <div class="category-cards"></div>
                        <div class="mod-cards"></div>
                    </div>
                </div>
            </section>
        `;
    }
}
customElements.define("product-categories", ProductCategories);

const productCategoriesTitle = [
    {
        name: "Mods",
        image: "/src/assets/images/cat-object-1-nobg.png",
        imageAlt: "",
    },
    {
        name: "Atomizers",
        image: "/src/assets/images/cat-object-2.1-nobg.png",
        imageAlt: "",
    },
    {
        name: "E-Juices",
        image: "/src/assets/images/cat-object-3.2-nobg.png",
        imageAlt: "",
    },
    {
        name: "Accessories",
        image: "/src/assets/images/cat-object-4-nobg.png",
        imageAlt: "",
    },
];

const categoryCards = document.querySelector(".category-cards");
productCategoriesTitle.forEach(category => {
    const categoryCard = document.createElement("div");
    categoryCard.className = "card";

    categoryCard.innerHTML = `
        <img src="${ category.image }" alt="${ category.imageAlt }" />
        <div class="category-card-title">
            <h6>${ category.name }</h6>
        </div>
    `;
    categoryCards.appendChild(categoryCard);
});

const typeOfMods = [
    {
        name: "Premuim Vapes",
        image: "/src/assets/images/cat-type-1.jpg",
        imageAlt: "",
    },
    {
        name: "Elite Vapor",
        image: "/src/assets/images/cat-type-2.jpg",
        imageAlt: "",
    }
];

const modCards = document.querySelector(".mod-cards");
typeOfMods.forEach(type => {
    const typeCard = document.createElement("div");
    typeCard.className = "card";

    typeCard.innerHTML = `
        <img src="${ type.image }" alt="${ type.imageAlt }" />
        <div class="mod-card-title">
            <h3>${ type.name }</h3>
        </div>
    `;
    modCards.appendChild(typeCard);
});