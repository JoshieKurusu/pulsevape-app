class blogSidebar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <div id="accordionSidebarBlogContent" class="accordion">
                <!-- SEARCH BAR -->
                <div class="accordion-item">
                    <div class="search-form-group">
                        <div class="form-group">
                            <input type="search" name="search" autocomplete="off" placeholder="Search here..." class="form-control" />
                        </div>
                        <button type="submit" class="btn search-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- BLOG CATEGORIES -->
                <div class="accordion-item">
                    <h6 class="accordion-header">
                        <button type="button" data-bs-toggle="collapse" data-bs-target="#blogCategoriesCollapse" aria-expanded="true" aria-controls="blogCategoriesCollapse" class="btn blog-categories-btn">
                            Categories
                            <span class="icon-toggle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 448 512" class="plus">
                                    <path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 448 512" class="minus">
                                    <path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z" />
                                </svg>
                            </span>
                        </button>
                    </h6>
                    <div id="blogCategoriesCollapse" class="accordion-collapse show">
                        <div class="accordion-body">
                            <ul class="blog-categories">
                                <li class="blog-categories-item">Business</li>
                                <li class="blog-categories-item">Vape Market</li>
                                <li class="blog-categories-item">E-juices</li>
                                <li class="blog-categories-item">Replacement</li>
                                <li class="blog-categories-item">Vape mod</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- RECENT POSTS -->
                <div class="accordion-item">
                    <h6 class="accordion-header">
                        <button type="button" data-bs-toggle="collapse" data-bs-target="#recentPostsCollapse" aria-expanded="true" aria-controls="recentPostsCollapse" class="btn recent-post-btn">
                            Recent Posts
                            <span class="icon-toggle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 448 512" class="plus">
                                    <path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 448 512" class="minus">
                                    <path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z" />
                                </svg>
                            </span>
                        </button>
                    </h6>
                    <div id="recentPostsCollapse" class="accordion-collapse show">
                        <div class="accordion-body">
                            <div class="recent-posts-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.fetchRecentPosts();
    }

    async fetchRecentPosts() {
        try {
            const response = await fetch("src/assets/data/blog-posts.json");
            const recentPosts = await response.json();
            const container = this.querySelector(".recent-posts-container");

            // CONVERT POST DATE TO TIMESTAMPS AND SORT DESCENDING
            const sortedPosts = recentPosts.map(post => ({
                ...post,
                timestamp: new Date(post.postDate).getTime()
            }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 4); // TAKE THE 4 MOST RECENT POST

            sortedPosts.forEach(post => {
                const postCard = document.createElement("div");
                postCard.className = "card recent-post-card";
                postCard.innerHTML = `
                    <img src="${ post.postImage }" alt="${ post.postImageAlt }" loading="lazy">
                    <div class="card-body">
                        <div class="blog-date-details">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                                <path fill="currentColor" d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-68-76a12,12,0,1,1-12-12A12,12,0,0,1,140,132Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,132ZM96,172a12,12,0,1,1-12-12A12,12,0,0,1,96,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,140,172Zm44,0a12,12,0,1,1-12-12A12,12,0,0,1,184,172Z" />
                            </svg>
                            <span class="date">${ post.postDate }</span>
                        </div>
                        <h6 class="blog-title">${ post.postTitle }</h6>
                    </div>
                `;
                container.append(postCard);
            });
        }
        catch (error) {
            console.error("Failed to fetch recent posts:", error);
        }
    }
}
customElements.define("blog-sidebar", blogSidebar);