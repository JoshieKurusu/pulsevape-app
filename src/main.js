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
                    import(configure.module).then(module => {
                        if (typeof module.initSidebarFilter === "function") {
                            module.initSidebarFilter();
                        }
                    });
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

// ADDING COMMA IF PRICE IS IN THOUSAND
function formatPrice(price) {
    return Number(price).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// CREATE A PRODUCT CARD
function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "card";
    productCard.id = product.id;
    productCard.setAttribute("data-price", product.price);

    productCard.innerHTML = `
        <img src="${ product.image }" alt="${ product.imageAlt }" loading="lazy" />
        <div class="card-body">
            <h6 class="product-name">${ product.name }</h6>
            <p class="product-description">${ product.description }</p>
            <h6 class="product-price">₱${ formatPrice(product.price) }</h6>
        </div>
    `;
    return productCard;
}

// TODO START: OFTEN CHAINED MANUALLY. CREATE A FUNCTION THAT HADNLES THE FULL PIPELINE
// FILTER PRODUCTS BY PRICE RANGE
function filterProductsByPrice(products, min, max) {
    return products.filter(product => {
        if (!product || typeof product.price === "undefined") return false;
        const price = parseFloat(product.price);
        return price >= min && price <= max;
    });
}
function filterProductsByBrand(products, getSelectedProductBrands) {
    if (!getSelectedProductBrands.length) return products; // NO FILTER APPLIED
    // products.forEach(product => console.log("Raw brand:", product.brand));

    return products.filter(product => {
        const normalizedBrand = product.brand?.toLowerCase().replace(/\s+/g, "-");
        return getSelectedProductBrands.includes(normalizedBrand);
    });
}
// TODO END

// PAGINATION LABEL
function getPaginationLabel(currentPage, cardsPerPage, totalItems) {
    const start = (currentPage - 1) * cardsPerPage + 1;
    const end = Math.min(currentPage * cardsPerPage, totalItems);
    return `Showing ${ start } - ${ end } of ${ totalItems } Results`
}

// RESPONSIVE CARDS PER PAGE
function getCardsPerPage(viewportWidth) {
    if (viewportWidth >= 768 && viewportWidth <= 992) return 9; // TABLET
    return 8; // Mobile & DESKTOP
}

// CONDENSED PAGE NUMBER
function getPageNumbers(currentPage, totalPage) {
    const pages = [];
    if (totalPage <= 5) {
        for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPage - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        if (currentPage < totalPage - 2) pages.push("...");
        pages.push(totalPage);
    }
    return pages;
}

// TODO START: WRAP THEM INTO ONE (1) FUNCTION THAT ACCEPT FILTERED PRODUCTS, HANDLES PAGINATION STATE, UPDATES BOTH PRODUCT GRID AND PAGINATION UI
// RENDER A SPECIFIC PAGE OF PRODUCTS
function renderPage(products, page = 1, cardsPerPage) {
    const productContainer = document.querySelector(".product-container");
    const paginationLabel = document.querySelector(".pagination-label");
    productContainer.innerHTML = "";

    const totalPage = Math.ceil(products.length / cardsPerPage);
    const safePage = Math.min(page, totalPage);
    window.currentPage = safePage;

    const start = (safePage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const sliceProducts = products.slice(start, end);

    sliceProducts.forEach(product => {
        const card = createProductCard(product);
        productContainer.appendChild(card);
    });

    // INJECT PAGINATION LABEL
    const label = getPaginationLabel(safePage, cardsPerPage, products.length);
    paginationLabel.textContent = label;

    renderPaginationControls(products.length, safePage, cardsPerPage)
}
// RENDER PAGINATION BUTTONS
function renderPaginationControls(totalItems, currentPage, cardsPerPage) {
    const paginationContainer = document.querySelector(".pagination-container");
    paginationContainer.innerHTML = "";

    const totalPage = Math.ceil(totalItems / cardsPerPage);
    const source = window.filteredProducts?.length ? window.filteredProducts : window.allProducts;

    // PREVIOUS BUTTON
    const previousBtn = document.createElement("button");
    previousBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 320 512">
            <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
    `;
    previousBtn.className = "btn prev-btn";
    previousBtn.type = "button";
    previousBtn.disabled = currentPage === 1;

    previousBtn.addEventListener("click", () => {
        window.currentPage--;
        renderPage(source, window.currentPage, cardsPerPage);
    });
    paginationContainer.appendChild(previousBtn);

    const viewport = window.innerWidth;

    if (viewport > 639) {
        // PAGE NUMBER BUTTONS
        const visiblePages = getPageNumbers(currentPage, totalPage);
        visiblePages.forEach(page => {
            const button = document.createElement("button");
            button.classList = "btn number-btn";
            button.textContent = page;

            if (page === "...") {
                button.disabled = true;
            } else {
                if (page === currentPage) button.classList.add("active");
                button.addEventListener("click", () => {
                    window.currentPage = page;
                    renderPage(source, page, cardsPerPage)
                });
            }
            paginationContainer.appendChild(button);
        });
    }

    // NEXT BUTTON
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 320 512">
            <path fill="currentColor" d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
        </svg>
    `;
    nextBtn.className = "btn next-btn";
    nextBtn.type = "button";
    nextBtn.disabled = currentPage === totalPage;

    nextBtn.addEventListener("click", () => {
        window.currentPage++;
        renderPage(source, window.currentPage, cardsPerPage);
    });
    paginationContainer.appendChild(nextBtn);
}
// TODO END

// INITIALIZE SETUP
function resetPaginationState() {
    window.currentPage = 1;
    window.filteredProducts = [];
}

function syncSelectedTypeButton({
    containerSelector,
    buttonPrefix,
    getSelectedFn,
    onRemoveCallback
}) {
    const checkboxes = document.querySelectorAll(`${ containerSelector } .form-check-input`);
    const selectedBtnsContainer = document.querySelector(".selected-btns");

    checkboxes.forEach(checkbox => {
        const btnId = `${ buttonPrefix }-${checkbox.id}`;
        const label = document.querySelector(`label[for="${ checkbox.id }"]`);
        const existingBtn = document.querySelector(`#${ btnId }`);

        if (checkbox.checked) {
            if (!existingBtn) {
                const typeBtn = createSelectedFilterButtons({
                    text: checkbox.dataset.label || label?.textContent || checkbox.id,
                    className: "btn selected-btn",
                    id: btnId,
                    onClick: (button) => {
                        button.remove();
                        checkbox.checked = false;

                        onRemoveCallback(getSelectedFn());
                        resetPriceFilterUI();

                        maybeShowClearAllButton()
                    }
                });
                selectedBtnsContainer.appendChild(typeBtn);
            }
        } else {
            if (existingBtn) existingBtn.remove();
        }
    });
    maybeShowClearAllButton();
}

function maybeShowClearAllButton() {
    const selectedBtnsContainer = document.querySelector(".selected-filters");
    const selectedBtns = selectedBtnsContainer.querySelectorAll(".selected-btn");
    existingClearBtn = document.querySelector("#clear-all-selected-btn");

    if (selectedBtns.length >= 3) {
        if (!existingClearBtn) {
            const clearBtn = createSelectedFilterButtons({
                text: "Clear All",
                className: "btn clear-all-btn",
                id: "clear-all-selected-btn",
                onClick: (button) => {
                    button.remove();
                    clearAllSelectedFilters();
                }
            });
            selectedBtnsContainer.appendChild(clearBtn);
        }
    } else {
        if (existingClearBtn) existingClearBtn.remove();
    }
}

function clearAllSelectedFilters() {
    const selectedBtnsContainer = document.querySelector(".selected-btns");
    const allCheckboxes = document.querySelectorAll(".form-check-input");

    // UNCHECK ALL FILTERS
    allCheckboxes.forEach(checkbox => checkbox.checked = false);

    // REMOVE ALL SELECTED BUTTONS
    const allSelectedBtns = selectedBtnsContainer.querySelectorAll(".selected-btn");
    allSelectedBtns.forEach(button => button.remove());

    // RESET PRICE FILTER UI
    resetPriceFilterUI();

    // DISABLE BRAND CHECKBOXES
    disableBrandCheckboxes();

    // RELOAD DATA WITH EMPTY FILTERS
    loadAllData([]);
}

// TODO START: REDUNDANT NEED TO CENTRALIZE THEM INTO SHARED JS MODULE
function getSelectedProductTypes() {
    const productTypeCheckboxes = document.querySelectorAll(".product-type-form-check .form-check-input");
    return Array.from(productTypeCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);
}
function getSelectedProductBrands() {
    const productBrandkboxes = document.querySelectorAll(".product-brand-form-check .form-check-input");
    return Array.from(productBrandkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id.toLowerCase());
}
// TODO END

// TODO START: CONSIDER MERGING SETUP + SYNC INTO A SINGLE IRCHESTRATOR PER FILTER TYPE
function setupProductTypeCheckboxes() {
    const productTypeCheckboxes = document.querySelectorAll(".product-type-form-check .form-check-input");

    productTypeCheckboxes.forEach(productTypeCheckbox => {
        productTypeCheckbox.addEventListener("change", () => {
            if (isAnyBrandChecked()) {
                // RESTRICT TO SINGLE-SELECT IF BRAND IS ACTIVE
                productTypeCheckboxes.forEach(checkboxes => {
                    if (checkboxes !== productTypeCheckbox) checkboxes.checked = false;
                });

                // REMOVE OTHER SELECTED BUTTONS
                const productTypeSelectedBtns = document.querySelectorAll(".selected-btn");
                productTypeSelectedBtns.forEach(buttons => {
                    if (buttons.id.startsWith("product-type-btn")) buttons.remove();
                });
            }

            // CLEAR BRAND FILTERS
            const productBrandCheckboxes = document.querySelectorAll(".product-brand-form-check .form-check-input");
            productBrandCheckboxes.forEach(checkboxes => checkboxes.checked = false);

            // REMOVE BRAND SELECTED BUTTONS
            const productBrandSelectedBtns = document.querySelectorAll(".selected-btn");
            productBrandSelectedBtns.forEach(buttons => {
                if (buttons.id.startsWith("product-brand-btn")) buttons.remove();
            });

            syncSelectedTypeButton({
                containerSelector: ".product-type-form-check",
                buttonPrefix: "product-type-btn",
                getSelectedFn: getSelectedProductTypes,
                onRemoveCallback: () => {
                    // UNCHECK ALL BRAND CHECKBOXES
                    productBrandCheckboxes.forEach(checkboxes => checkboxes.checked = false);

                    // REMOVE ALL BRAND SELECTED BUTTONS
                    const productBrandSelectedBtns = document.querySelectorAll(".selected-btn");
                    productBrandSelectedBtns.forEach(buttons => {
                        if (buttons.id.startsWith("product-brand-btn")) buttons.remove();
                    });

                    // DISABLE BRAND CHECKBOXES
                    disableBrandCheckboxes();

                    // RELOAD WITH UPDATED FILTERS
                    loadAllData(getSelectedProductTypes());
                }
            });

            // ENABLE BRAND CHECKBOXES IF ONE TYPE IS SELECTED
            if (isAnyTypeChecked()) {
                enableBrandCheckboxes();
            } else {
                disableBrandCheckboxes();
            }

            const selectedProductType = getSelectedProductTypes();
            loadAllData(selectedProductType);

            resetPriceFilterUI();
            console.log("Product types checked:", getSelectedProductTypes());
        });
    });
}
function setupProductBrandCheckboxes() {
    const brandTypeCheckboxes = document.querySelectorAll(".product-brand-form-check .form-check-input");

    brandTypeCheckboxes.forEach(brandTypeCheckbox => {
        brandTypeCheckbox.addEventListener("change", () => {
            syncSelectedTypeButton({
                containerSelector: ".product-brand-form-check",
                buttonPrefix: "product-brand-btn",
                getSelectedFn: getSelectedProductBrands,
                onRemoveCallback: getSelectedProductBrands
            });

            resetPriceFilterUI();
            getSelectedProductBrands();
        });
        // console.log("Brand checkboxes enabled?", isAnyBrandChecked());
    });
}
// TODO END

function isAnyTypeChecked() {
    return [...document.querySelectorAll(".product-type-form-check .form-check-input")].some(checkboxes => checkboxes.checked);
}

function isAnyBrandChecked() {
    return [...document.querySelectorAll(".product-brand-form-check .form-check-input")].some(checkboxes => checkboxes.checked);
}

function disableBrandCheckboxes() {
    const brandTypeCheckboxes = document.querySelectorAll(".product-brand-form-check .form-check-input");
    brandTypeCheckboxes.forEach(checkboxes => checkboxes.disabled = true);
}

function enableBrandCheckboxes() {
    const brandTypeCheckboxes = document.querySelectorAll(".product-brand-form-check .form-check-input");
    brandTypeCheckboxes.forEach(checkboxes => checkboxes.disabled = false);
}

function getDataFiles(getSelectedProductTypes) {
    const fileMap = {
        accessories: "src/assets/data/accessories.json",
        vapeMods: "src/assets/data/mods.json",
        atomizers: "src/assets/data/atomizers.json",
        ejuices: "src/assets/data/e-juices.json"
    };

    return getSelectedProductTypes.length
        ? getSelectedProductTypes.map(productType => fileMap[productType])
        : Object.values(fileMap); // DEFAULT: LOAD ALL
}

// FETCHING THE ALL THE DATA FROM THE 4 JSON FILES
async function loadAllData(getSelectedProductTypes = []) {
    // JSON FILE URLS
    const dataFiles = getDataFiles(getSelectedProductTypes);

    try {
        const responses = await Promise.all(dataFiles.map(url => fetch(url)));
        const dataArray = await Promise.all(responses.map(res => res.json()));
        const combinedData = dataArray.flat(); // USE .flat() IF EACH FILE RETURNS AN ARRAY

        window.allProducts = combinedData; // STORE GLOBALLY FOR PAGINATION
        window.filteredProducts = [];
        window.currentPage = 1;

        const viewport = window.innerWidth;
        const cardsPerPage = getCardsPerPage(viewport);
        renderPage(combinedData, window.currentPage, cardsPerPage);
    } catch (error) {
        console.error("Error fetching JSON files:", error);
    }
}

// TODO START: CREATE A JS MODILE THAT ENCAPSULATES INPUT VALIDATION, SLIDER FILL UPDATES, FILTER TRIGGERING, BUTTON CREATION
// FILTER PRICE RANGE MIN AND MAX PRICE
const minValue = document.querySelector(".min-value");
const maxValue = document.querySelector(".max-value");

const priceInputMin = document.querySelector(".min-input");
const priceInputMax = document.querySelector(".max-input");

const range = document.querySelector(".slider-fill");

const minGap = 0;

let previousMin = null;
let previousMax = null;
let priceRangeManuallyRemoved = false;

const sliderMinValue = parseFloat(minValue.min);
const sliderMaxValue = parseFloat(maxValue.max);

function slideMin() {
    let gap = parseFloat(maxValue.value) - parseFloat(minValue.value);
    if (gap <= minGap) {
        minValue.value = parseFloat(maxValue.value) - minGap;
    }
    // console.log(`Low: ${ minValue.value }`);

    priceInputMin.value = minValue.value;
    setArea();
}
function slideMax() {
    let gap = parseFloat(maxValue.value) - parseFloat(minValue.value);
    if (gap <= minGap) {
        maxValue.value = parseFloat(minValue.value) + minGap;
    }
    // console.log(`High: ${ maxValue.value }`);

    priceInputMax.value = maxValue.value;
    setArea();
}
function setMinInput() {
    let minPrice = parseFloat(priceInputMin.value);
    if (minPrice < sliderMinValue) {
        priceInputMin.value = sliderMinValue;
    }

    minValue.value = priceInputMin.value;
    slideMin();
}
function setMaxInput() {
    let maxPrice = parseFloat(priceInputMax.value);
    if (maxPrice > sliderMaxValue) {
        priceInputMax.value = sliderMaxValue;
    }

    maxValue.value = priceInputMax.value;
    slideMax();
}
function setArea() {
    if (!window.allProducts || !Array.isArray(window.allProducts)) {
        console.warn("Product data not loaded yet.");
        return;
    }

    const min = parseFloat(minValue.value);
    const max = parseFloat(maxValue.value);
    // console.log(`Price Range: ${ minValue.value } - ${ maxValue.value }`);

    const priceFiltered = filterProductsByPrice(window.allProducts, min, max);
    const brandFiltered = filterProductsByBrand(priceFiltered, getSelectedProductBrands());

    const minPercent = (min / sliderMaxValue) * 100;
    const maxPercent = (max / sliderMaxValue) * 100;

    range.style.left = `${ minPercent }%`;
    range.style.right = `${ 100 - maxPercent }%`;

    // FILTER AND RENDER PAGE 1
    window.filteredProducts = brandFiltered;
    window.currentPage = 1;

    renderPage(window.filteredProducts, window.currentPage);
    // console.log("Filtered Products:", window.filteredProducts.map(p => `${p.name} - ₱${p.price}`));
    // console.log(`Excluded products: ${window.allProducts.length - window.filteredProducts.length}`);

    // ONLY UPDATE BUTTON IF VALUES CHANGED
    if ((min !== previousMin || max !== previousMax) && !priceRangeManuallyRemoved) {
        const selectedBtnsContainer = document.querySelector(".selected-btns");
        const existingPriceRangeBtn = document.querySelector("#price-range-btn");
        const newText = `Min ₱${min} - Max ₱${max}`;

        if (existingPriceRangeBtn) {
            const textSpan = existingPriceRangeBtn.querySelector(".filter-text");
            if (textSpan) textSpan.textContent = newText;
        } else {
            const priceRange = createSelectedFilterButtons({
                text: newText,
                className: "btn selected-btn",
                id: "price-range-btn",
                onClick: (button) => {
                    button.remove();
                    priceRangeManuallyRemoved = true;

                    setTimeout(() => {
                        resetPriceFilterUI();
                        priceRangeManuallyRemoved = false; // RESET SUPPRESSION AFTER SLIDER RESET
                    }, 0);
                }
            });
            selectedBtnsContainer.appendChild(priceRange);
        }
    }
}
// TODO END

function resetPriceFilterUI() {
    // checkbox.checked = false;
    // RESET PRICE RANGE
    minValue.value = minValue.min;
    maxValue.value = maxValue.max;

    slideMin();
    slideMax();

    document.querySelector("#price-range-btn")?.remove();
}

function createSelectedFilterButtons({ text = "", className = "btn", id = "", onClick = null }) {
    const selectedFilterBtn = document.createElement("button");
    selectedFilterBtn.className = className;
    if (id) selectedFilterBtn.id = id;

    // CREATE TEXT SPAN ELEMENT
    const textSpan = document.createElement("span");
    textSpan.className = "filter-text";
    textSpan.textContent = text;

    // CREATE REUSEABLE SVG ICON
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("width", "13");
    svgIcon.setAttribute("height", "13");
    svgIcon.setAttribute("viewBox", "0 0 384 512");
    svgIcon.innerHTML = `
        <path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z" />
    `;

    // ATTACH CLICK TO SVG
    if (typeof onClick === "function") {
        svgIcon.addEventListener("click", () => onClick(selectedFilterBtn)); // PASS THE BUTTON TO THE HANDLER
        selectedFilterBtn.addEventListener("click", (event) => onClick(selectedFilterBtn, event));  // PASS THE SVG HANDLER TO THE BUTTON
    }

    selectedFilterBtn.appendChild(textSpan);
    selectedFilterBtn.appendChild(svgIcon);

    return selectedFilterBtn;
}

window.onload = () => {
    // DISABLE THE FILTER BY BRAND CHECKBOXES
    disableBrandCheckboxes();

    // ENSURE THE PAGINATION SYSTEM IS STABLE
    resetPaginationState()
    //  KICK OFF THE DATA LOADING
    loadAllData();

    // SLIDER FOR FILTER PRICE RANGE
    slideMin();
    slideMax();

    // PRODUCT TYPE CHECKBOXES
    setupProductTypeCheckboxes();
    // PRODUCT BRAND CHECKBOXES
    setupProductBrandCheckboxes();
}

window.addEventListener("resize", () => {
    const viewport = window.innerWidth;
    const cardsPerPage = getCardsPerPage(viewport);
    const source = window.filteredProducts?.length ? window.filteredProducts : window.allProducts;
    renderPage(source, window.currentPage, cardsPerPage);
});
