import { createProductCard } from "./components/section/productCard.js";

document.addEventListener("DOMContentLoaded", () => {
    // LAZY COMPONENTS
    const lazySections = [
        { selector: "#category-section", module: "./components/section/productCategories.js"},
        { selector: "#best-seller-section", module: "./components/section/bestSeller.js"},
        { selector: "#brand-logo-section", module: "./components/section/brandsLogo.js"},
        { selector: "#banner-section", module: "./components/section/banner.js"},
        { selector: "#blog-post-sidebar", module: "./components/section/blogSidebar.js"}
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

    // carouselItems(); // LOAD POSTS INTO CAROUSEL
    // carouselClickDrag(); // THEN INITIALIZE DRAG LOGIC

    loadBlogPostData(); // LOAD THE BLOG POST DATA

    disableBrandCheckboxes(); // DISABLE THE FILTER BY BRAND CHECKBOXES

    resetPaginationState(); // ENSURE THE PAGINATION SYSTEM IS STABLE

    loadAllProductData(); // KICK OFF THE DATA LOADING

    // ATTACH EVENT LISTENERS. THERE'S NO NEED FOR INLINE onChange/oninput
    if (priceInputMin && priceInputMax) {
        // INPUT VALUE FOR FITLER PRICE RANGE
        priceInputMin.addEventListener("input", setMinInput);
        priceInputMax.addEventListener("input", setMaxInput);
    }

    if (minValue && maxValue) {
        // SLIDER FOR FILTER PRICE RANGE
        minValue.addEventListener("input", slideMin);
        maxValue.addEventListener("input", slideMax);
    }

    // PRODUCT TYPE, BRAND, MODEL TYPE CHECKBOXES
    setupProductTypeCheckboxes();
    setupProductBrandCheckboxes();
    setupModelTypeCheckboxes();

    loadStaticCounters(); // STATIC PRODUCT COUNTER

    filtersFromQuery();
});

window.addEventListener("resize", () => {
    renderCurrentFilteredPage();
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
    products.forEach(product => console.log("Raw brand:", product.brand));

    return products.filter(product => {
        const normalizedBrand = product.brand?.toLowerCase().replace(/\s+/g, "-");
        return getSelectedProductBrands.includes(normalizedBrand);
    });
}
function filterModelType(products, getSelectedModelTypes) {
    if (!getSelectedModelTypes.length) return products; // NO FILTER APPLIED
    // products.forEach(product => console.log("Raw types:", product.type));

    return products.filter(product => {
        const normalizedModel = product.type?.toLowerCase().replace(/\s+/g, "-");
        return getSelectedModelTypes.includes(normalizedModel);
    });
}
// TODO END

function filtersFromQuery() {
    const urlParams = new URLSearchParams(window.location.search); // PARSE THE QUERY STRING
    const category = urlParams.get("category"); // "vapeMods" or "atomizers" or "ejuices" or "accessories"
    const type = urlParams.get("type"); // "variable" or "mechanical"

    if (category) {
        const checkbox = document.getElementById(category);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event("change")); // triggers your existing logic
        }
    }

    if (type) {
        const typeCheckbox = document.getElementById(type);
        if (typeCheckbox) {
            typeCheckbox.checked = true;
            typeCheckbox.dispatchEvent(new Event("change"));
        }
    }
}

// SHOP PAGE PAGINATION LABEL
function getPaginationLabel(currentPage, cardsPerPage, totalItems) {
    if (totalItems === 0) return "Showing 0 - 0 of 0 Results";

    const safePage = Math.max(currentPage, 1);
    const start = (safePage - 1) * cardsPerPage + 1;
    const end = Math.min(safePage * cardsPerPage, totalItems);

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
function renderPaginatedList({
    items,
    page = 1,
    cardsPerPage = getCardsPerPage(window.innerWidth),
    containerSelector,
    paginationSelector,
    labelSelector,
    renderItem,
    getLabel = getPaginationLabel,
    onPageChange = () => {},
}) {
    const container = document.querySelector(containerSelector);
    const paginationLabel = labelSelector ? document.querySelector(labelSelector) : null;
    const paginationContainer = document.querySelector(paginationSelector);

    if (!container || !paginationContainer) return;

    container.innerHTML = "";
    paginationContainer.innerHTML = "";

    const totalPage = Math.ceil(items.length / cardsPerPage);
    const safePage = Math.max(1, Math.min(page, totalPage));
    const start = (safePage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const slice = items.slice(start, end);

    slice.forEach(item => container.appendChild(renderItem(item)));

    if (paginationLabel) {
        paginationLabel.textContent = getLabel(safePage, cardsPerPage, items.length);
    }

    renderPaginationControls({
        totalItems: items.length,
        currentPage: safePage,
        cardsPerPage,
        paginationContainer,
        onPageChange: (newPage) => {
            renderPaginatedList({
                items,
                page: newPage,
                cardsPerPage,
                containerSelector,
                paginationSelector,
                labelSelector,
                renderItem,
                getLabel,
                onPageChange,
            });
            onPageChange(newPage);
        }
    });
}
function renderPaginationControls({
    totalItems,
    currentPage,
    cardsPerPage,
    paginationContainer,
    onPageChange
}) {
    const totalPage = Math.ceil(totalItems / cardsPerPage);
    const viewport = window.innerWidth;

    const createBtn = (label, disabled, onClick, className = "") => {
        const paginationBtn = document.createElement("button");
        paginationBtn.className = `btn ${ className }`;
        paginationBtn.textContent = label;
        paginationBtn.disabled = disabled;
        paginationBtn.addEventListener("click", onClick);
        return paginationBtn;
    };

    paginationContainer.appendChild(createBtn("←", currentPage === 1, () => onPageChange(currentPage - 1), "prev-btn"));

    if (viewport >= 576) {
        getPageNumbers(currentPage, totalPage).forEach(page => {
            const paginationBtn = createBtn(page, page === "...", () => onPageChange(page), "number-btn");
            if (page === currentPage) paginationBtn.classList.add("active");
            paginationContainer.appendChild(paginationBtn);
        });
    }

    paginationContainer.appendChild(createBtn("→", currentPage === totalPage, () => onPageChange(currentPage + 1), "next-btn"));
}

// SHOP PAGE PAGINATION
renderPaginatedList({
    items: Array.isArray(window.filteredProducts) && window.filteredProducts.length ? window.filteredProducts : Array.isArray(window.allProducts) ? window.allProducts : [],
    containerSelector: ".product-container",
    paginationSelector: ".pagination-container",
    labelSelector: ".pagination-label",
    renderItem: createProductCard
});
// TODO END

function renderShopPage(source) {
    renderPaginatedList({
        items: source,
        page: window.currentPage || 1,
        cardsPerPage: getCardsPerPage(window.innerWidth),
        containerSelector: ".product-container",
        paginationSelector: ".pagination-container",
        labelSelector: ".pagination-label",
        renderItem: createProductCard
    });
}

function renderCurrentFilteredPage() {
    const viewport = window.innerWidth;
    const cardsPerPage = getCardsPerPage(viewport);
    const source = window.filteredProducts?.length ? window.filteredProducts : window.allProducts;
    renderPaginatedList({
        items: source,
        page: window.currentPage,
        cardsPerPage,
        containerSelector: ".product-container",
        paginationSelector: ".pagination-container",
        labelSelector: ".pagination-label",
        renderItem: createProductCard
    });
}

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
    const existingClearBtn = document.querySelector("#clear-all-selected-btn");

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
        // console.log("Clear All button exist.");
    }
}

function clearAllSelectedFilters() {
    const selectedBtnsContainer = document.querySelector(".selected-btns");
    const allCheckboxes = document.querySelectorAll(".form-check-input");
    const modelTypeContainer = document.querySelector(".model-type-filter");

    modelTypeContainer.style.display = "none"; // HIDE THE FILTER BY MODEL TYPE

    allCheckboxes.forEach(checkbox => checkbox.checked = false); // UNCHECK ALL FILTERS

    // REMOVE ALL SELECTED BUTTONS
    const allSelectedBtns = selectedBtnsContainer.querySelectorAll(".selected-btn");
    allSelectedBtns.forEach(button => button.remove());

    resetPriceFilterUI(); // RESET PRICE FILTER UI

    disableBrandCheckboxes(); // DISABLE BRAND CHECKBOXES

    loadAllProductData([]); // RELOAD DATA WITH EMPTY FILTERS
}

// TODO START: REDUNDANT NEED TO CENTRALIZE THEM INTO SHARED JS MODULE
function getSelectedProductTypes() {
    const productTypeCheckboxes = document.querySelectorAll(".product-type-form-check .form-check-input");
    return Array.from(productTypeCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);
}
function getSelectedProductBrands() {
    const productBrandCheckboxes = document.querySelectorAll(".product-brand-form-check .form-check-input");
    return Array.from(productBrandCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id.toLowerCase());
}
function getSelectedModelTypes() {
    const modelTypeCheckboxes = document.querySelectorAll(".model-type-form-check .form-check-input");
    return Array.from(modelTypeCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.dataset.slug || checkbox.id.toLowerCase());
}
// TODO END

// TODO START: CONSIDER MERGING SETUP + SYNC INTO A SINGLE IRCHESTRATOR PER FILTER TYPE
function setupProductTypeCheckboxes() {
    const productTypeCheckboxes = document.querySelectorAll(".product-type-form-check .form-check-input");
    productTypeCheckboxes.forEach(productTypeCheckbox => {
        productTypeCheckbox.addEventListener("change", () => {
            const isVapeModSelected = Array.from(productTypeCheckboxes)
                .some(cb => cb.checked && cb.id === "vapeMods");

            const modelTypeContainer = document.querySelector(".model-type-filter");
            modelTypeContainer.style.display = isVapeModSelected ? "block" : "none";
            // console.log("Vape Mod selected:", isVapeModSelected);

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

            // CLEAR MODEL TYPE FILTERS
            const modelTypeCheckboxes = document.querySelectorAll(".model-type-form-check .form-check-input");
            modelTypeCheckboxes.forEach(checkboxes => checkboxes.checked = false);

            // REMOVE ALL BRAND OR MODEL SELECTED BUTTONS
            const productSelectedBtns = document.querySelectorAll(".selected-btn");
            productSelectedBtns.forEach(buttons => {
                if (buttons.id.startsWith("product-brand-btn") || buttons.id.startsWith("model-type-btn")) buttons.remove();
            });

            syncSelectedTypeButton({
                containerSelector: ".product-type-form-check",
                buttonPrefix: "product-type-btn",
                getSelectedFn: getSelectedProductTypes,
                onRemoveCallback: () => {
                    productBrandCheckboxes.forEach(checkboxes => checkboxes.checked = false); // UNCHECK ALL BRAND CHECKBOXES

                    modelTypeCheckboxes.forEach(checkboxes => checkboxes.checked = false); // UNCHECK ALL MODEL TYPE CHECKBOXES

                    modelTypeContainer.style.display = "none"; // HIDE THE FILTER BY MODEL TYPE

                    // REMOVE ALL BRAND OR MODEL SELECTED BUTTONS
                    const productSelectedBtns = document.querySelectorAll(".selected-btn");
                    productSelectedBtns.forEach(buttons => {
                        if (buttons.id.startsWith("product-brand-btn") || buttons.id.startsWith("model-type-btn")) buttons.remove();
                    });

                    disableBrandCheckboxes(); // DISABLE BRAND CHECKBOXES

                    loadAllProductData(getSelectedProductTypes()); // RELOAD WITH UPDATED FILTERS
                }
            });

            // ENABLE BRAND CHECKBOXES IF ONE TYPE IS SELECTED
            if (isAnyTypeChecked()) {
                enableBrandCheckboxes();
            } else {
                disableBrandCheckboxes();
            }

            const selectedProductType = getSelectedProductTypes();
            loadAllProductData(selectedProductType);

            resetPriceFilterUI();
            // console.log("Product types checked:", getSelectedProductTypes());
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
function setupModelTypeCheckboxes() {
    const modelTypeCheckboxes = document.querySelectorAll(".model-type-form-check .form-check-input");
    // console.log("Model Type checkboxes found:", modelTypeCheckboxes.length);
    modelTypeCheckboxes.forEach(modelTypeCheckbox => {
        modelTypeCheckbox.addEventListener("change", () => {
            // SYNC SELECTED FILTER BUTTONS
            syncSelectedTypeButton({
                containerSelector: ".model-type-form-check",
                buttonPrefix: "model-type-btn",
                getSelectedFn: getSelectedModelTypes,
                onRemoveCallback: () => {
                    loadAllProductData(getSelectedProductTypes(), getSelectedModelTypes()); // When a model type filter is removed, reload products with updated filters
                }
            });

            resetPriceFilterUI();

            // ENSURE PARENT vapeMods IS SELECTED IF ANY MODEL TYPE IS CHECKED
            const selectedModelTypes = getSelectedModelTypes();
            if (selectedModelTypes.length > 0) {
                const vapeModsCheckbox = document.getElementById("vapeMods");
                if (vapeModsCheckbox && !vapeModsCheckbox.checked) {
                    vapeModsCheckbox.checked = true;
                    vapeModsCheckbox.dispatchEvent(new Event("change"));
                }
            }

            // RELOAD PRODUCTS WITH BOTH PRODUCT TYPE AND MODEL TYPE FILTERS
            const selectedProductType = getSelectedProductTypes();
            loadAllProductData(selectedProductType, selectedModelTypes);
        });
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

// FETCHING THE ALL THE DATA FROM THE 4 PRODUCTS JSON FILES
async function loadAllProductData(getSelectedProductTypes = [], getSelectedModelTypes = []) {
    const dataFiles = getDataFiles(getSelectedProductTypes); // JSON FILE URLS

    try {
        const responses = await Promise.all(dataFiles.map(url => fetch(url)));
        const dataArray = await Promise.all(responses.map(res => res.json()));
        let combinedData = dataArray.flat(); // USE .flat() IF EACH FILE RETURNS AN ARRAY

        // FILTER BY MODEL TYPE IF AN ARE SELECTED
        if (getSelectedModelTypes.length > 0) {
            combinedData = combinedData.filter(product =>
                getSelectedModelTypes.includes(product.type?.toLowerCase().replace(/\s+/g, "-"))
            );
        }

        window.allProducts = combinedData; // STORE GLOBALLY FOR PAGINATION
        window.filteredProducts = [];
        window.currentPage = 1;

        renderShopPage(combinedData);
    } catch (error) {
        console.error("Error fetching JSON files:", error);
    }
}

// STATIC PRODUCT COUNTERS
function loadStaticCounters() {
    const filePaths = getDataFiles([]);
    const counterRegistry = {
        productType: {},
        brand: {},
        type: {}
    };

    const filePromises = filePaths.map(path => {
        const key = path.split("/").pop().replace(".json", "");

        return fetch(path)
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) return;

            counterRegistry.productType[key] = data.length; // COUNT BY PRODUCT TYPE

            data.forEach(product => {
                // COUNT BY BRAND
                const brand = product.brand?.toLowerCase().replace(/\s+/g, "-");
                if (brand) {
                    counterRegistry.brand[brand] = (counterRegistry.brand[brand] || 0) + 1;
                }

                // COUNT BY MODEL TYPE
                const model = product.type?.toLowerCase().replace(/\s+/g, "-");
                if (model) {
                    counterRegistry.type[model] = (counterRegistry.type[model] || 0) + 1;
                }
            })
        })
        .catch(error => {
            console.warn(`Failed to load ${ key }`, error);
            counterRegistry[key] = 0;
        });
    });

    Promise.all(filePromises).then(() => {
        updateUICounters(counterRegistry); // console.log("Static File Counters:", counterRegistry);
    });
}

// DOM PRODUCT COUNTERS
function updateUICounters(registry) {
    // PRODUCT TYPE COUNTERS
    Object.entries(registry.productType).forEach(([key, count]) => {
        const productCounter = document.querySelector(`.${ key }-counter`);
        if (productCounter) productCounter.textContent = `(${ String(count).padStart(2, "0") })`;
    });

    // BRAND COUNTERS
    Object.entries(registry.brand).forEach(([brand, count]) => {
        const brandCounter = document.querySelector(`.${ brand }-counter`);
        if (brandCounter) brandCounter.textContent = `(${ String(count).padStart(2, "0") })`;
    });

    // MODEL TYPE COUNTERS
    Object.entries(registry.type).forEach(([type, count]) => {
        const typeCounter = document.querySelector(`.${ type }-counter`);
        if (typeCounter) typeCounter.textContent = `(${ String(count).padStart(2, "0") })`;
    });
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

const sliderMinValue = minValue ? parseFloat(minValue.min) : 0;
const sliderMaxValue = maxValue ? parseFloat(maxValue.max) : 100;

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
    let rawMinPrice = priceInputMin.value
    let minPrice = parseFloat(rawMinPrice);

    if (!rawMinPrice || isNaN(minPrice)) {
        minPrice = sliderMinValue; // FALLBACK TO MIN
        priceInputMin.value = minPrice
    }

    if (minPrice < sliderMinValue) {
        priceInputMin.value = sliderMinValue;
    }

    minValue.value = minPrice;
    slideMin();
}
function setMaxInput() {
    let rawMaxPrice = priceInputMax.value
    let maxPrice = parseFloat(rawMaxPrice);

    if (!rawMaxPrice || isNaN(maxPrice)) {
        maxPrice = sliderMaxValue; // FALLBACK TO MAX
        priceInputMax.value = maxPrice;
    }

    if (maxPrice > sliderMaxValue) {
        priceInputMax.value = sliderMaxValue;
    }

    maxValue.value = maxPrice;
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

    const minPercent = (min / sliderMaxValue) * 100;
    const maxPercent = (max / sliderMaxValue) * 100;

    range.style.left = `${ minPercent }%`;
    range.style.right = `${ 100 - maxPercent }%`;

    const selectedBrands = getSelectedProductBrands();
    const selectedModels = getSelectedModelTypes();
    let filtered = filterProductsByPrice(window.allProducts, min, max);

    if (selectedBrands.length) {
        filtered = filterProductsByBrand(filtered, selectedBrands);
    }

    if (selectedModels.length) {
        filtered = filterModelType(filtered, selectedModels);
    }

    // FILTER AND RENDER PAGE 1
    window.filteredProducts = filtered;
    window.currentPage = 1;
    renderShopPage(window.filteredProducts);
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

// USE URLSearchParams TO READ THE ID from THE URL
const urlParams = new URLSearchParams(window.location.search);
const blogPostId = urlParams.get("id");

// FETCH THE BLOG POST DATA
async function loadBlogPostData() {
    const postContainer = document.querySelector(".post-container");
    const postContentContainer = document.querySelector(".post-content");
    if (!postContainer && !postContentContainer) return; // EXIT EARLY IF NOT ON BLOG PAGE

    try {
        const response = await fetch("src/assets/data/blog-posts.json");
        const blogPostData = await response.json();
        const allPosts = blogPostData;

        const isDetailPage = blogPostId !== null;

        if(!isDetailPage && postContainer) {
            allPosts.forEach(post => {
                const postCard = createBlogPostCard(post, "post-card");
                postContainer.appendChild(postCard);
            });
        }

        window.blogPosts = allPosts;
        window.currentBlogPage = 1;
        renderBlogPage(window.blogPosts);

        if (isDetailPage && postContentContainer) {
            const targetPost = blogPostData.find(post => String(post.id) === blogPostId);
            if (targetPost) {
                const postContentCard = createPostContentCard(targetPost);
                postContentContainer.appendChild(postContentCard);
            }
        }

        carouselItems(blogPostData, blogPostId);
        carouselClickDrag();
    }
    catch (error) {
        console.error("Failed to fetch recent posts:", error);
    }
}

// BLOG PAGE POST
function createBlogPostCard(post, variant = "post-card") {
    const postCard = document.createElement("div");
    postCard.className = `card ${ variant }`;
    postCard.innerHTML = `
        <div class="img-block">
            <img src="${ post.postImage }" alt="${ post.postImageAlt }" loading="lazy">
        </div>
        <div class="card-body">
            <div class="title-date-container">
                <a href="/pulsevape-app/blog-details.html?id=${ post.id }" class="blog-title">${ post.postTitle }</a>
                <div class="blog-date-details">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z" />
                    </svg>
                    <span class="date">${ post.postDate }</span>
                </div>
            </div>
            <p class="minimum-time">10 MIN READ</p>
            <p class="blog-description">${ post.postDescription }</p>
        </div>
    `;
    return postCard;
}

// BLOG PAGE PAGINATION
function renderBlogPage(blogPageData) {
    renderPaginatedList({
        items: blogPageData,
        page: window.currentBlogPage || 1,
        cardsPerPage: 6,
        containerSelector: ".post-container",
        paginationSelector: ".pagination-container",
        labelSelector: null,
        renderItem: createBlogPostCard
    });
}

// BLOG DETAILS PAGE POST CONTENT
function createPostContentCard(post) {
    const postContentCard = document.createElement("div");
    postContentCard.className = "card target-post-card";
    postContentCard.innerHTML = `
        <div class="img-block">
            <img src="src/assets/images/sample-blog-post-details-img.jpg" alt="${ post.postImageAlt }"> <!--TODO: CHANGE THE SRC TO DYNAMIC -->
        </div>
        <div class="card-body">
            <h3 class="post-title">${ post.postTitle }</h3>
            <p class="minimum-time">10 MIN READ</p>
            <p class="post-paragraph">${ post.postContent }</p>
        </div>
    `;
    return postContentCard;
}

// CUSTOM CAROUSEL FOR CLICK AND DRAG
function carouselClickDrag() {
    const carouselTrack = document.querySelector(".carousel-track");
    if (!carouselTrack) return; // STOP IF NOT FOUND

    const firstItem = carouselTrack.querySelector(".carousel-items");
    if (!firstItem) return; // STOP IF NO ITEMS YET

    const firstCardWidth = firstItem.offsetWidth;
    const carouselTrackChildren = [...carouselTrack.children];

    let isDragging = false, startX, startScrollLeft;
    let carouselItemPerView = Math.round(carouselTrack.offsetWidth / firstCardWidth);

    // CLONE LAST FEW CAROUSEL ITEMS TO THE BEGINNING
    carouselTrackChildren.slice(-carouselItemPerView).reverse().forEach(carouselItem => {
        carouselTrack.insertAdjacentHTML("afterbegin", carouselItem.outerHTML);
    });

    // CLONE FIRST FEW CAROUSEL ITEMS TO THE END
    carouselTrackChildren.slice(0, carouselItemPerView).forEach(carouselItem => {
        carouselTrack.insertAdjacentHTML("beforeend", carouselItem.outerHTML);
    });

    // POSITION CAROUSEL TO HIDE THE CLONED CAROUSEL ITEMS
    carouselTrack.classList.add("no-transition");
    carouselTrack.scrollLeft = carouselTrack.offsetWidth;
    carouselTrack.classList.remove("no-transition");

    // DRAG LOGIC
    const dragStart = (event) => {
        isDragging = true;

        carouselTrack.classList.add("dragging");
        startX = event.pageX;
        startScrollLeft = carouselTrack.scrollLeft;
    };

    const dragging = (event) => {
        if (!isDragging) return;
        carouselTrack.scrollLeft = startScrollLeft - (event.pageX - startX);
    };

    const dragStop = () => {
        isDragging = false;
        carouselTrack.classList.remove("dragging");
    };

    // INFINITE SCROLL RESET
    const infiniteScroll = () => {
        if (carouselTrack.scrollLeft === 0) {
            carouselTrack.classList.add("no-transition");
            carouselTrack.scrollLeft = carouselTrack.scrollWidth - (2 * carouselTrack.offsetWidth);
            carouselTrack.classList.remove("no-transition");
        }
        else if (Math.ceil(carouselTrack.scrollLeft) === carouselTrack.scrollWidth - carouselTrack.offsetWidth) {
            carouselTrack.classList.add("no-transition");
            carouselTrack.scrollLeft = carouselTrack.offsetWidth;
            carouselTrack.classList.remove("no-transition");
        }
        else {
            return;
        }
    }

    // EVENT LISTERNERS
    carouselTrack.addEventListener("mousedown", dragStart);
    carouselTrack.addEventListener("mousemove", dragging);
    carouselTrack.addEventListener("mouseup", dragStop);
    carouselTrack.addEventListener("scroll", infiniteScroll);
}

// BLOG POST FOR CAROUSEL-ITEMS
function carouselItems(posts, targetPostId) {
    const carouselTrack = document.querySelector(".carousel-track");
    if (!carouselTrack || !Array.isArray(posts)) return;

    posts.forEach(post => {
        if (String(post.id) === String(targetPostId)) return; // SKIP THE TARGETED POST

        // CREATE A CAROUSEL-ITEMS AND APPEND
        const carouselItem = createBlogPostCard(post, "carousel-items");
        carouselTrack.append(carouselItem);
    });
}