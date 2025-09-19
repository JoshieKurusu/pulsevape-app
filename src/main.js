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

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();

        const selected = event.target.getAttribute("data-value");
        // console.log("Selected Option:", selected);

        document.querySelector(".selectedOption").textContent = selected;
    });
});

window.onload = () => {
    slideMin();
    slideMax();
};

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