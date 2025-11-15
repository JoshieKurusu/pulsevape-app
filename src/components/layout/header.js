class Header extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // * DO THIS BEFORE UPLOADING IN GITHUB
        // * ADD /pulsevape-app INSIDE THE HREF BEFORE THE shop.html, blogs.html, AND about-us.html
        this.innerHTML = `
            <header>
                <nav class="navbar navbar-expand-md">
                    <div class="container-fluid">
                        <a href="/pulsevape-app" class="navbar-brand">
                            <img  src="src/assets/images/pulseVape-brand-name-no-bg-2.png" alt="PulseVape">
                        </a>
                        <button type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-label="Toggle navigation" class="navbar-toggler">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="offcanvas offcanvas-start" id="navbarContent">
                            <a href="/pulsevape-app" class="navbar-brand d-md-none">
                                <img  src="src/assets/images/pulseVape-brand-name-no-bg-2.png" alt="PulseVape">
                            </a>
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a href="/pulsevape-app" id="nav-home" class="nav-link">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/pulsevape-app/shop.html" id="nav-shop" class="nav-link">Shop</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/pulsevape-app/blogs.html" id="nav-blogs" class="nav-link">Blogs</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/pulsevape-app/about-us.html" id="nav-about" class="nav-link">About Us</a>
                                </li>
                            </ul>
                            <div class="menu-contact-info d-md-none">
                                <p class="menu-contact-item">
                                    <span class="circle-bg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z" />
                                        </svg>
                                    </span>
                                    <span class="menu-contact">example@company.com</span>
                                </p>
                                <p class="menu-contact-item">
                                    <span class="circle-bg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M351.8 25c7.8-18.8 28.4-28.9 48.1-23.5l5.5 1.5c64.6 17.6 119.8 80.2 103.7 156.4-37.1 175-174.8 312.7-349.8 349.8-76.3 16.2-138.8-39.1-156.4-103.7l-1.5-5.5c-5.4-19.7 4.7-40.3 23.5-48.1l97.3-40.5c16.5-6.9 35.6-2.1 47 11.8l38.6 47.2c70.3-34.9 126.8-93.3 159.3-164.9l-44.1-36.1c-13.9-11.3-18.6-30.4-11.8-47L351.8 25z" />
                                        </svg>
                                    </span>
                                    <span class="menu-contact">+123 (4567) 890</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }
}
customElements.define("header-component", Header);

function initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    const normalizePath = path => {
        const cleaned = path.replace(/\/$/, "").replace(/\.html/, "");
        return cleaned === "" ? "/" : cleaned;
    };

    const currentPath = normalizePath(window.location.pathname);

    // * DO THIS BEFORE UPLOADING IN GITHUB
    // * CHANGE THE PATH TO /pulsevape-app, /pulsevape-app/shop, /pulsevape-app/blogs, /pulsevape-app/about-us
    const pageLinks = [
        { path: "/pulsevape-app", navId: "nav-home" },
        { path: "/pulsevape-app/shop", navId: "nav-shop" },
        { path: "/pulsevape-app/blogs", navId: "nav-blogs" },
        { path: "/pulsevape-app/blog-details", navId: "nav-blogs" }, // MAP blog-details TO nav-blogs
        { path: "/pulsevape-app/about-us", navId: "nav-about" },
    ];

    const match = pageLinks.find(link => currentPath === link.path);

    if (match) {
        navLinks.forEach(link => link.classList.remove("active"));
        const activeLink = document.getElementById(match.navId);
        activeLink?.classList.add("active");
    }

    if (!window.location.href.includes(".html")) {
        navLinks.forEach(navLink => {
            navLink.addEventListener("click", (event) => {
                navLinks.forEach(link => link.classList.remove("active"));
                event.currentTarget.classList.add("active");
            });
        });
    }
}
initializeNavigation();