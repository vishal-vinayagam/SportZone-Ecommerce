// Sample product data


// Cart functionality
let cart = [];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const overlay = document.querySelector('.overlay');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const testimonialSlides = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let badgeHTML = '';
        if (product.badge) {
            badgeHTML = `<span class="product-badge">${product.badge}</span>`;
        }
        
        let oldPriceHTML = '';
        if (product.oldPrice) {
            oldPriceHTML = `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <div>
                        ${oldPriceHTML}
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification(product.title);
}

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="decrement" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increment" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="remove-item" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    // Update total
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', incrementQuantity);
    });
    
    document.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', decrementQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Increment quantity
function incrementQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

// Decrement quantity
function decrementQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
    } else if (item && item.quantity === 1) {
        // Remove item if quantity becomes 0
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
}

// Remove item
function removeItem(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show cart notification
function showCartNotification(productTitle) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
        <p>${productTitle} has been added to your cart!</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Testimonial slider
let currentSlide = 0;

function showSlide(n) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
    
    testimonialSlides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
    
    // Cart toggle
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Testimonial slider
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Auto slide
    setInterval(nextSlide, 5000);
});

// Notification styles (added via JavaScript to keep CSS cleaner)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1100;
    }
    
    .notification.show {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);