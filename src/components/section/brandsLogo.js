class brandsLogo extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const file = `/src/assets/data/brands.json`;

        this.innerHTML = `
            <section id="brand-logo-section" class="brand-logo-section">
                <div class="container-fluid">
                    <div class="brand-logo-content"></div>
                </div>
            </section>
        `;
        fetch(file)
        .then(response => response.json())
        .then(brands => {
            const brandCardsContainer = document.querySelector(".brand-logo-content");

            brands.forEach(brand => {
                const brandCard = document.createElement("div");
                brandCard.className = "card";
                brandCard.id = `${ brand.id }`;
                brandCard.innerHTML = `
                    <img src="${ brand.brandLogo }" alt="${ brand.brandLogoAlt }" />
                `;
                brandCardsContainer.appendChild(brandCard);
            });
        })
        .catch(err => console.error("Error loading data:", err));
    }
}
customElements.define("brands-logo", brandsLogo);

window.onload = () => {
    const track = document.querySelector(".brand-logo-content");
    const cards = Array.from(track.children);
    const trackWidth = track.scrollWidth;

    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add("cloned");
        track.appendChild(clone);
    });

    let offset = 0;
    const speed = 1;

    function animate() {
        offset -= speed;
        // console.log("Current offset:", offset);

        if (Math.abs(offset) >= trackWidth) {
            offset = 0;
            // console.log("Resetting offset to 0");
        }
        track.style.transform = `translateX(${ offset }px)`;
        requestAnimationFrame(animate);
    }
    animate();
};