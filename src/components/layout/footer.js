class Footer extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // * DO THIS BEFORE UPLOADING IN GITHUB
        // * CHANGE THE HREF="/" TO HREF="/pulsevape-app"
        this.innerHTML = `
            <footer>
                <div class="container-fluid">
                    <div class="footer-top">
                        <div class="footer-top-column-1">
                            <div class="footer-branding">
                                <a href="/pulsevape-app" class="brand">
                                    <img src="src/assets/images/pulseVape-brand-name-no-bg-2.png" alt="PulseVape">
                                </a>
                                <p class="paragraph">Experience unparalleled flavor and smooth clouds with Elite Vapor.</p>
                                <ul class="social-bar">
                                    <li class="social-bar-item">
                                        <a href="#" class="social-bar-link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 256 256">
                                                <path fill="currentColor" d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li class="social-bar-item">
                                        <a href="#" class="social-bar-link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 256 256">
                                                <path fill="currentColor" d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li class="social-bar-item">
                                        <a href="#" class="social-bar-link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 256 256">
                                                <path fill="currentColor" d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z" />
                                            </svg>
                                        </a>
                                    </li>
                                    <li class="social-bar-item">
                                        <a href="#" class="social-bar-link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 256 256">
                                                <path fill="currentColor" d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z" />
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer-top-column-2">
                            <div class="footer-links">
                                <h4 class="heading">Useful Links</h4>
                                <ul class="useful-link-list">
                                    <li class="useful-link-item">
                                        <a href="/pulsevape-app/about-us.html" class="useful-link">About Us</a>
                                    </li>
                                    <li class="useful-link-item">
                                        <a href="/pulsevape-app/shop.html" class="useful-link">Product Items</a>
                                    </li>
                                    <li class="useful-link-item">
                                        <a href="#" class="useful-link">Contact Us</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="footer-contact">
                                <h4 class="heading">Contact Us</h4>
                                <ul class="contact-list">
                                    <li class="contact-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256">
                                            <path fill="currentColor" d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
                                        </svg>
                                        <span>Dasmariñas City, Cavite, Philippines</span>
                                    </li>
                                    <li class="contact-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256">
                                            <path fill="currentColor" d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
                                        </svg>
                                        <span>+123 (4567) 890</span>
                                    </li>
                                    <li class="contact-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256">
                                            <path fill="currentColor" d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
                                        </svg>
                                        <span>example@company.com</span>
                                    </li>
                                    <li class="contact-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256">
                                            <path fill="currentColor" d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
                                        </svg>
                                        <span>10:00 am - 11:00 pm</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p class="copyright">&copy PulseVape 2025. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}
customElements.define("footer-component", Footer);