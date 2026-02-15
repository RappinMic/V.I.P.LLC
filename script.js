// Art Gallery Data
const artworks = [
    {
        id: 1,
        title: "Abstract Sunrise",
        artist: "Maria Chen",
        price: 1200,
        image: "🌅"
    },
    {
        id: 2,
        title: "Urban Dreams",
        artist: "James Wilson",
        price: 950,
        image: "🏙️"
    },
    {
        id: 3,
        title: "Ocean Waves",
        artist: "Sophie Martinez",
        price: 1500,
        image: "🌊"
    },
    {
        id: 4,
        title: "Mountain Serenity",
        artist: "David Lee",
        price: 1100,
        image: "⛰️"
    },
    {
        id: 5,
        title: "Cosmic Journey",
        artist: "Emma Thompson",
        price: 1800,
        image: "🌌"
    },
    {
        id: 6,
        title: "Floral Symphony",
        artist: "Oliver Brown",
        price: 850,
        image: "🌺"
    }
];

// Apparel Products Data
const products = [
    {
        id: 101,
        name: "Art Gallery T-Shirt",
        category: "tshirts",
        price: 29.99,
        image: "👕"
    },
    {
        id: 102,
        name: "Abstract Art Hoodie",
        category: "hoodies",
        price: 59.99,
        image: "🧥"
    },
    {
        id: 103,
        name: "VIP Classic Tee",
        category: "tshirts",
        price: 24.99,
        image: "👕"
    },
    {
        id: 104,
        name: "Artist Signature Cap",
        category: "accessories",
        price: 19.99,
        image: "🧢"
    },
    {
        id: 105,
        name: "Gallery Zip Hoodie",
        category: "hoodies",
        price: 64.99,
        image: "🧥"
    },
    {
        id: 106,
        name: "Art Lover Tote Bag",
        category: "accessories",
        price: 15.99,
        image: "👜"
    },
    {
        id: 107,
        name: "Premium Art T-Shirt",
        category: "tshirts",
        price: 34.99,
        image: "👕"
    },
    {
        id: 108,
        name: "Creative Backpack",
        category: "accessories",
        price: 49.99,
        image: "🎒"
    }
];

// Shopping Cart
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    loadProducts();
    setupNavigation();
    setupFilters();
    loadCart();
});

// Load art gallery
function loadGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    artworks.forEach(artwork => {
        const artworkCard = document.createElement('div');
        artworkCard.className = 'gallery-item';
        artworkCard.innerHTML = `
            <div class="gallery-item-image" style="font-size: 8rem; text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                ${artwork.image}
            </div>
            <div class="gallery-info">
                <h3>${artwork.title}</h3>
                <p class="artist">by ${artwork.artist}</p>
                <p class="price">$${artwork.price}</p>
            </div>
        `;
        galleryGrid.appendChild(artworkCard);
    });
}

// Load products
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p class="price">$${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Setup category filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const category = this.dataset.category;
            loadProducts(category);
        });
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    saveCart();
    
    // Show feedback
    showNotification('Item added to cart!');
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveCart();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order!\n\nTotal: $${total.toFixed(2)}\n\nYour order will be processed shortly.`);
    
    // Clear cart
    cart = [];
    updateCart();
    saveCart();
    toggleCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('vip-cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('vip-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        toggleCart();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
