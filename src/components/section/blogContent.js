class blogContent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        `;
        this.fetchBlogContent();
    }

    async fetchBlogContent() {
        try {
            const response = await fetch("src/assets/data/blog-posts.json");
            const blogPostData = await response.json();
        }
        catch (error) {
            console.error("Failed to fetch recent posts:", error);
        }
    }
}
customElements.define("blog-content", blogContent);