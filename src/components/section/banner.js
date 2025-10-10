class Banner extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const title = this.getAttribute("title") || "";
        this.innerHTML = `
            <div class="container-fluid">
                <div class="banner-content">
                    <h2 class="banner-header">${ title }</h2>
                </div>
            </div>
        `;
    }
}
customElements.define("banner-content", Banner);