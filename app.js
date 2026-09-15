const products = [
    {
        id: 1,
        name: "iPhone",
        price: 59999,
        category: "electronics",
        image: "images/products/Iphone.png",
        rating: 5,
        description: "A modern smartphone with powerful performance and excellent features."
    },
    {
        id: 2,
        name: "Samsung",
        price: 69999,
        category: "electronics",
        image: "images/products/samsung.png",
        rating: 4,
        description: "A premium Samsung smartphone with a beautiful display and powerful performance."
    },
    {
        id: 3,
        name: "Google Pixel",
        price: 49999,
        category: "electronics",
        image: "images/products/google Pixel.png",
        rating: 5,
        description: "Google Pixel with excellent camera features and smooth performance."
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* =========================
   COMMON FUNCTIONS
========================= */

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(price) {
    return price.toLocaleString("en-IN");
}

function getStars(rating) {
    return "⭐".repeat(rating);
}


/* =========================
   ADD TO CART
========================= */

function addToCart(productId) {

    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const existingProduct = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();

    alert(product.name + " added to cart!");
}


/* =========================
   PRODUCT CARD
========================= */

function createProductCard(product) {

    return `
        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p class="product-price">
                ₹${formatPrice(product.price)}
            </p>

            <p class="product-rating">
                ${getStars(product.rating)}
            </p>

            <a
                href="product-details.html?id=${product.id}"
                class="main-button"
            >
                View Details
            </a>

            <button
                type="button"
                onclick="addToCart(${product.id})"
            >
                Add to Cart
            </button>

        </div>
    `;
}


/* =========================
   HOME PRODUCTS
========================= */

function displayHomeProducts() {

    const homeProductGrid =
        document.getElementById("home-product-grid");

    if (!homeProductGrid) {
        return;
    }

    homeProductGrid.innerHTML = products
        .map(createProductCard)
        .join("");
}


/* =========================
   PRODUCTS PAGE
========================= */

function displayProducts(productList = products) {

    const productGrid =
        document.getElementById("product-grid");

    if (!productGrid) {
        return;
    }

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p>No products found.</p>
        `;

        return;
    }

    productGrid.innerHTML = productList
        .map(createProductCard)
        .join("");
}


/* =========================
   FILTER PRODUCTS
========================= */

function setupFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-button");

    if (filterButtons.length === 0) {
        return;
    }

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const category =
                button.getAttribute("data-category");

            if (category === "all") {
                displayProducts(products);
            } else {

                const filteredProducts =
                    products.filter(function (product) {
                        return product.category === category;
                    });

                displayProducts(filteredProducts);
            }
        });
    });
}


/* =========================
   SORT PRODUCTS
========================= */

function setupSort() {

    const sortSelect =
        document.getElementById("sort-products");

    if (!sortSelect) {
        return;
    }

    sortSelect.addEventListener("change", function () {

        let sortedProducts = [...products];

        if (sortSelect.value === "low-high") {

            sortedProducts.sort(function (a, b) {
                return a.price - b.price;
            });

        } else if (sortSelect.value === "high-low") {

            sortedProducts.sort(function (a, b) {
                return b.price - a.price;
            });
        }

        displayProducts(sortedProducts);
    });
}


/* =========================
   CATEGORY FROM URL
========================= */

function loadCategoryFromURL() {

    const productGrid =
        document.getElementById("product-grid");

    if (!productGrid) {
        return;
    }

    const urlParams =
        new URLSearchParams(window.location.search);

    const category =
        urlParams.get("category");

    if (!category) {
        return;
    }

    const filteredProducts =
        products.filter(function (product) {
            return product.category === category;
        });

    displayProducts(filteredProducts);

    const filterButtons =
        document.querySelectorAll(".filter-button");

    filterButtons.forEach(function (button) {

        if (button.getAttribute("data-category") === category) {

            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
        }
    });
}


/* =========================
   SEARCH
========================= */

function setupSearch() {

    const searchInput =
        document.getElementById("search-input");

    const searchButton =
        document.getElementById("search-button");

    if (!searchInput || !searchButton) {
        return;
    }

    function performSearch() {

        const searchText =
            searchInput.value.trim().toLowerCase();

        if (searchText === "") {
            window.location.href = "products.html";
            return;
        }

        const filteredProducts =
            products.filter(function (product) {

                return product.name
                    .toLowerCase()
                    .includes(searchText);
            });

        const productGrid =
            document.getElementById("product-grid");

        if (productGrid) {

            displayProducts(filteredProducts);

        } else {

            window.location.href =
                "products.html?search=" +
                encodeURIComponent(searchText);
        }
    }

    searchButton.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            performSearch();
        }
    });
}


/* =========================
   SEARCH FROM URL
========================= */

function loadSearchFromURL() {

    const productGrid =
        document.getElementById("product-grid");

    if (!productGrid) {
        return;
    }

    const urlParams =
        new URLSearchParams(window.location.search);

    const searchText =
        urlParams.get("search");

    if (!searchText) {
        return;
    }

    const filteredProducts =
        products.filter(function (product) {

            return product.name
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });

    displayProducts(filteredProducts);
}


/* =========================
   PRODUCT DETAILS
========================= */

function displayProductDetails() {

    const container =
        document.getElementById("product-details-container");

    if (!container) {
        return;
    }

    const urlParams =
        new URLSearchParams(window.location.search);

    const productId =
        Number(urlParams.get("id")) || 1;

    const product =
        products.find(function (item) {
            return item.id === productId;
        });

    if (!product) {

        container.innerHTML = `
            <h2>Product not found.</h2>
            <a href="products.html" class="main-button">
                Back to Products
            </a>
        `;

        return;
    }

    container.innerHTML = `

        <div class="product-detail-card">

            <div class="product-detail-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
            </div>

            <div class="product-detail-info">

                <h2>${product.name}</h2>

                <p class="product-rating">
                    ${getStars(product.rating)}
                </p>

                <p class="product-price">
                    ₹${formatPrice(product.price)}
                </p>

                <p>
                    ${product.description}
                </p>

                <br>

                <button
                    type="button"
                    class="main-button"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

                <a
                    href="products.html"
                    class="main-button"
                >
                    Back to Products
                </a>

            </div>

        </div>
    `;
}


/* =========================
   CART DISPLAY
========================= */

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    if (!cartItems) {
        return;
    }

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>Your cart is empty.</h3>
                    <br>
                    <a href="products.html" class="main-button">
                        Start Shopping
                    </a>
                </div>
            </div>
        `;

        updateCartTotals();

        return;
    }

    cartItems.innerHTML = cart.map(function (item) {

        return `
            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>
                        Price:
                        ₹${formatPrice(item.price)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            onclick="decreaseQuantity(${item.id})"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            onclick="increaseQuantity(${item.id})"
                        >
                            +
                        </button>

                    </div>

                    <p>
                        Total:
                        ₹${formatPrice(item.price * item.quantity)}
                    </p>

                    <button
                        type="button"
                        class="remove-button"
                        onclick="removeFromCart(${item.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;

    }).join("");

    updateCartTotals();
}


/* =========================
   INCREASE QUANTITY
========================= */

function increaseQuantity(productId) {

    const item =
        cart.find(function (product) {
            return product.id === productId;
        });

    if (item) {
        item.quantity++;
    }

    saveCart();
    displayCart();
}


/* =========================
   DECREASE QUANTITY
========================= */

function decreaseQuantity(productId) {

    const item =
        cart.find(function (product) {
            return product.id === productId;
        });

    if (!item) {
        return;
    }

    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart = cart.filter(function (product) {
            return product.id !== productId;
        });
    }

    saveCart();
    displayCart();
}


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(productId) {

    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    saveCart();
    displayCart();
}


/* =========================
   CART TOTALS
========================= */

function updateCartTotals() {

    const subtotalElement =
        document.getElementById("subtotal");

    const shippingElement =
        document.getElementById("shipping");

    const totalElement =
        document.getElementById("total");

    if (!subtotalElement ||
        !shippingElement ||
        !totalElement) {
        return;
    }

    const subtotal =
        cart.reduce(function (total, item) {

            return total +
                (item.price * item.quantity);

        }, 0);

    const shipping = 0;

    const total = subtotal + shipping;

    subtotalElement.textContent =
        formatPrice(subtotal);

    shippingElement.textContent =
        formatPrice(shipping);

    totalElement.textContent =
        formatPrice(total);
}


/* =========================
   CHECKOUT DISPLAY
========================= */

function displayCheckout() {

    const checkoutItems =
        document.getElementById("checkout-items");

    if (!checkoutItems) {
        return;
    }

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>
            <br>
            <a href="products.html" class="main-button">
                Start Shopping
            </a>
        `;

        updateCheckoutTotals();

        return;
    }

    checkoutItems.innerHTML =
        cart.map(function (item) {

            return `
                <div class="checkout-item">

                    <span>
                        ${item.name}
                        x ${item.quantity}
                    </span>

                    <span>
                        ₹${formatPrice(
                            item.price * item.quantity
                        )}
                    </span>

                </div>
            `;

        }).join("");

    updateCheckoutTotals();
}


/* =========================
   CHECKOUT TOTALS
========================= */

function updateCheckoutTotals() {

    const subtotalElement =
        document.getElementById("checkout-subtotal");

    const shippingElement =
        document.getElementById("checkout-shipping");

    const totalElement =
        document.getElementById("checkout-total");

    if (!subtotalElement ||
        !shippingElement ||
        !totalElement) {
        return;
    }

    const subtotal =
        cart.reduce(function (total, item) {

            return total +
                (item.price * item.quantity);

        }, 0);

    const shipping = 0;

    const total = subtotal + shipping;

    subtotalElement.textContent =
        formatPrice(subtotal);

    shippingElement.textContent =
        formatPrice(shipping);

    totalElement.textContent =
        formatPrice(total);
}


/* =========================
   CHECKOUT FORM
========================= */

function setupCheckoutForm() {

    const checkoutForm =
        document.getElementById("checkout-form");

    if (!checkoutForm) {
        return;
    }

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }

        alert(
            "Order placed successfully! Thank you for shopping with ShopEasy."
        );

        cart = [];

        saveCart();

        window.location.href = "index.html";
    });
}


/* =========================
   CONTACT FORM
========================= */

function setupContactForm() {

    const contactForm =
        document.getElementById("contact-form");

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
            "Thank you! Your message has been sent successfully."
        );

        contactForm.reset();
    });
}


/* =========================
   NEWSLETTER
========================= */

function setupNewsletter() {

    const newsletterForm =
        document.getElementById("newsletter-form");

    if (!newsletterForm) {
        return;
    }

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
            "Thank you for subscribing to ShopEasy!"
        );

        newsletterForm.reset();
    });
}


/* =========================
   LOGIN
========================= */

function setupLogin() {

    const loginForm =
        document.getElementById("login-form");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
            "Login functionality will be connected to the backend later."
        );
    });
}


/* =========================
   REGISTER
========================= */

function setupRegister() {

    const registerForm =
        document.getElementById("register-form");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const password =
            document.getElementById("register-password").value;

        const confirmPassword =
            document.getElementById("register-confirm").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }

        alert(
            "Account created successfully!"
        );

        window.location.href = "login.html";
    });
}


/* =========================
   FORGOT PASSWORD
========================= */

function setupForgotPassword() {

    const forgotForm =
        document.getElementById("forgot-form");

    if (!forgotForm) {
        return;
    }

    forgotForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert(
            "Password reset instructions have been sent to your email."
        );

        forgotForm.reset();
    });
}


/* =========================
   RUN FUNCTIONS
========================= */

document.addEventListener("DOMContentLoaded", function () {

    displayHomeProducts();

    displayProducts();

    loadCategoryFromURL();

    loadSearchFromURL();

    displayProductDetails();

    displayCart();

    displayCheckout();

    setupFilters();

    setupSort();

    setupSearch();

    setupCheckoutForm();

    setupContactForm();

    setupNewsletter();

    setupLogin();

    setupRegister();

    setupForgotPassword();

});