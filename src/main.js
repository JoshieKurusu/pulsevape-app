// LAZY COMPONENTS
document.addEventListener("DOMContentLoaded", () => {
    const lazySections = [
        { selector: "#category-section", module: "./components/section/productCategories.js"},
        { selector: "#best-seller-section", module: "./components/section/bestSeller.js"},
        { selector: "#brand-logo-section", module: "./components/section/brandsLogo.js"}
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const configure = lazySections.find(s => s.selector === `#${ target.id }`);

                if (configure) {
                    import(configure.module);
                    observer.unobserve(target);
                }
            }
        });
    });

    lazySections.forEach(({ selector }) => {
        const element = document.querySelector(selector);
        if (element) observer.observe(element);
    });
});

// CHANGE THE SELECTED OPTION TEXT IN DROPDOWN BUTTON
document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();

        const selected = event.target.getAttribute("data-value");
        // console.log("Selected Option:", selected);

        document.querySelector(".selectedOption").textContent = selected;
    });
});

// MODULAR FUNCTION TO CREATE A PRODUCT CARD
function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "card";
    productCard.id = product.id;

    productCard.innerHTML = `
        <img src="${ product.image }" alt="${ product.imageAlt }" loading="lazy" />
        <div class="card-body">
            <h6 class="product-name">${ product.name }</h6>
            <p class="product-description">${ product.description }</p>
            <h6 class="product-price">₱${ product.price }</h6>
        </div>
    `;
    return productCard;
}

// RENDER A SPECIFIC PAGE OF PRODUCTS
function renderPage(products, page = 1, cardsPerPage = 8) {
    const productContainer = document.querySelector(".product-container");
    productContainer.innerHTML = "";

    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const sliceProducts = products.slice(start, end);

    sliceProducts.forEach(product => {
        const card = createProductCard(product);
        productContainer.appendChild(card);
    });
    renderPaginationControls(products.length, page, cardsPerPage)
}

// RENDER PAGINATION BUTTONS
function renderPaginationControls(totalItems, currentPage, cardsPerPage) {
    const paginationContainer = document.querySelector(".pagination-container");
    paginationContainer.innerHTML = "";

    const totalPage = Math.ceil(totalItems / cardsPerPage);

    // PREVIOUS BUTTON
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.className = "btn prev-btn";
    prevBtn.type = "button";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => renderPage(window.allProducts, currentPage - 1, cardsPerPage));
    paginationContainer.appendChild(prevBtn);

    // PAGE NUMBER BUTTONS
    for (let i = 1; i <= totalPage; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `btn number-btn ${ i === currentPage ? "active" : "" }`;
        btn.type = "button";
        btn.addEventListener("click", () => renderPage(window.allProducts, i, cardsPerPage));
        paginationContainer.appendChild(btn);
    }

    // NEXT BUTTON
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.className = "btn next-btn";
    nextBtn.type = "button";
    nextBtn.disabled = currentPage === totalPage;
    nextBtn.addEventListener("click", () => renderPage(window.allProducts, currentPage + 1, cardsPerPage));
    paginationContainer.appendChild(nextBtn);
}

// FETCHING THE ALL THE DATA FROM THE 4 JSON FILES
async function loadAllData() {
    // JSON FILE URLS
    const jsonFiles = [
        "/src/assets/data/accessories.json",
        "/src/assets/data/atomizers.json",
        "/src/assets/data/e-juices.json",
        "/src/assets/data/mods.json"
    ];

    try {
        const responses = await Promise.all(jsonFiles.map(url => fetch(url)));
        const dataArray = await Promise.all(responses.map(res => res.json()));
        const combinedData = dataArray.flat(); // USE .flat() IF EACH FILE RETURNS AN ARRAY

        window.allProducts = combinedData; // STORE GLOBALLY FOR PAGINATION
        renderPage(combinedData, 1);
    } catch (error) {
        console.error("Error fetching JSON files:", error);
    }
}
//  KICK OFF THE DATA LOADING
loadAllData();

window.onload = () => {
    // SLIDER FOR FILTER PRICE RANGE
    slideMin();
    slideMax();
}

// FILTER PRICE RANGE MIN AND MAX PRICE
const minValue = document.querySelector(".min-value");
const maxValue = document.querySelector(".max-value");

const priceInputMin = document.querySelector(".min-input");
const priceInputMax = document.querySelector(".max-input");

const range = document.querySelector(".slider-fill");

const minGap = 0;
const sliderMinValue = parseInt(minValue.min);
const sliderMaxValue = parseInt(maxValue.max);

function slideMin() {
    let gap = parseInt(maxValue.value) - parseInt(minValue.value);
    if (gap <= minGap) {
        minValue.value = parseInt(maxValue.value) - minGap;
    }

    priceInputMin.value = minValue.value;
    setArea();
}

function slideMax() {
    let gap = parseInt(maxValue.value) - parseInt(minValue.value);
    if (gap <= minGap) {
        maxValue.value = parseInt(minValue.value) + minGap;
    }

    priceInputMax.value = maxValue.value;
    setArea();
}

function setArea() {
    const min = parseInt(minValue.value);
    const max = parseInt(maxValue.value);

    const minPercent = (min / sliderMaxValue) * 100;
    const maxPercent = (max / sliderMaxValue) * 100;

    range.style.left = `${ minPercent }%`;
    range.style.right = `${ 100 - maxPercent }%`;
}

function setMinInput() {
    let minPrice = parseInt(priceInputMin.value);
    if (minPrice < sliderMinValue) {
        priceInputMin.value = sliderMinValue;
    }

    minValue.value = priceInputMin.value;
    slideMin();
}

function setMaxInput() {
    let maxPrice = parseInt(priceInputMax.value);
    if (maxPrice > sliderMaxValue) {
        priceInputMax.value = sliderMaxValue;
    }

    maxValue.value = priceInputMax.value;
    slideMax();
}