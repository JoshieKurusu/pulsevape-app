class ProductCategories extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div class="container-fluid">
                <div class="category-content">
                    <h4 class="category-heading">Product Categories</h4>
                    <div class="category-cards"></div>
                    <div class="type-of-mod-cards"></div>
                </div>
            </div>
        `;
    }
}
customElements.define("product-categories", ProductCategories);

const productCategoriesTitle = [
    {
        name: "Mods",
        image: "/src/assets/images/category-mod-no-bg.png",
        imageAlt: "Mods category image",
    },
    {
        name: "Atomizers",
        image: "/src/assets/images/category-atomizer-1-no-bg.png",
        imageAlt: "Atomizers category image",
    },
    {
        name: "E-Juices",
        image: "/src/assets/images/category-ejuice-no-bg.png",
        imageAlt: "E-Juices category image",
    },
    {
        name: "Accessories",
        image: "/src/assets/images/category-accessories-no-bg.png",
        imageAlt: "Accessories category image",
    },
];

const typeOfMods = [
    {
        name: "Premuim Vapes",
        image: "src/assets/images/category-mod-type.jpg",
        imageAlt: "Premium Vapes image",
    },
    {
        name: "Elite Vapor",
        image: "src/assets/images/category-mod-type-1.jpg",
        imageAlt: "Elite Vapor image",
    }
];

// REUSEABLE CARD CREATION FUNCTION
function createCategoryCard({ name, image, imageAlt }, titleTag= "h6", titleClass = "card-title") {
    const categoryCard = document.createElement("div");
    categoryCard.className = "card";

    const img = document.createElement("img");
    img.src = image;
    img.alt = imageAlt;
    img.loading = "lazy";

    const titleWrapper = document.createElement("div");
    titleWrapper.className = titleClass;

    const title = document.createElement(titleTag);
    title.textContent = name;

    titleWrapper.appendChild(title);
    categoryCard.appendChild(img);
    categoryCard.appendChild(titleWrapper);

    return categoryCard;
}

// RENDER CATEGORY CARDS
const categoryCards = document.querySelector(".category-cards");
if (categoryCards) {
    productCategoriesTitle.forEach(category => {
        categoryCards.appendChild(createCategoryCard(category, "h6", "category-card-title"));
    });
}

// RENDER TYPE OF MODS CARDS
const typeOfModCards = document.querySelector(".type-of-mod-cards");
if (typeOfModCards) {
    typeOfMods.forEach(category => {
        typeOfModCards.appendChild(createCategoryCard(category, "h3", "type-of-mod-card-title"));
    });
}
