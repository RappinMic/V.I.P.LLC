// Wrap EVERYTHING in an IIFE to prevent global scope pollution
(function () {
"use strict";

// =====================
// Safe DOM Helper
// =====================
function safeGet(id) {
    return document.getElementById(id) || null;
}

// =====================
// Data
// =====================
const artworks = [
    { id: 1, title: "Abstract Sunrise", artist: "Maria Chen", price: 1200, image: "🌅" },
    { id: 2, title: "Urban Dreams", artist: "James Wilson", price: 950, image: "🏙️" },
    { id: 3, title: "Ocean Waves", artist: "Sophie Martinez", price: 1500, image: "🌊" },
    { id: 4, title: "Mountain Serenity", artist: "David Lee", price: 1100, image: "⛰️" },
    { id: 5, title: "Cosmic Journey", artist: "Emma Thompson", price: 1800, image: "🌌" },
    { id: 6, title: "Floral Symphony", artist: "Oliver Brown", price: 850, image: "🌺" }
];

const products = [
    { id: 101, name: "Art Gallery T-Shirt", category: "tshirts", price: 29.99, image: "👕" },
    { id: 102, name: "Abstract Art Hoodie", category: "hoodies", price: 59.99, image: "🧥" },
    { id: 103, name: "VIP Classic Tee", category: "tshirts", price: 24.99, image: "👕" },
    { id: 104, name: "Artist Signature Cap", category: "accessories", price: 19.99, image: "🧢" }
];

let cart = [];

// =====================
// Init
// =====================
document.addEventListener("DOMContentLoaded", () => {
    loadGallery();
    loadProducts();
    setupNavigation();
    setupFilters();
    loadCart();
    injectAnimations();
});

// =====================
// Gallery
// =====================
function loadGallery() {
    const galleryGrid = safeGet("gallery-grid");
    if (!galleryGrid) return;

    artworks.forEach(artwork => {
        const card = document.createElement("div");
        card.className = "gallery-item";
        card.innerHTML = `
            <div style="font-size:6rem;text-align:center;padding:30px;">
                ${artwork.image}
            </div>
            <div>
                <h3>${artwork.title}</h3>
                <p>by ${artwork.artist}</p>
                <p>$${Number(artwork.price).toFixed(2)}</p>
            </div>
        `;
        galleryGrid.appendChild(card);
    });
}

// =====================
// Products
// =====================
function loadProducts(filter = "all") {
    const grid = safeGet("products-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const filtered = filter === "all"
        ? products
        : products.filter(p => p.category === filter);

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.addEventListener("click", () => addToCart(product.id));

        card.innerHTML = `
            <div>${product.image}</div>
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
        `;
        card.appendChild(button);
        grid.appendChild(card);
    });
}

// =====================
// Cart Logic
// =====================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(i => i.id === id);
    existing ? existing.quantity++ :
        cart.push({ id, name: product.name, price: product.price, quantity: 1 });

    updateCart();
    saveCart();
    showNotification("Item added to cart!");
}

function updateCart() {
    const cartCount = safeGet("cart-count");
    const cartItems = safeGet("cart-items");
    const cartTotal = safeGet("cart-total");

    if (!cartItems || !cartTotal || !cartCount) return;

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = "<div>Your cart is empty</div>";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div>
                ${item.name} (${item.quantity})
                - $${(item.price * item.quantity).toFixed(2)}
                <button data-id="${item.id}" class="remove-btn">Remove</button>
            </div>
        `).join("");

        cartItems.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                removeFromCart(Number(btn.dataset.id));
            });
        });
    }

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    saveCart();
}

// =====================
// Storage (Safe)
// =====================
function saveCart() {
    try {
        localStorage.setItem("vip-cart", JSON.stringify(cart));
    } catch (e) {
        console.warn("Storage not available");
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem("vip-cart");
        if (saved) {
            cart = JSON.parse(saved) || [];
            updateCart();
        }
    } catch (e) {
        cart = [];
    }
}

// =====================
// UI
// =====================
function showNotification(msg) {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.cssText = `
        position:fixed;
        top:20px;
        right:20px;
        background:#27ae60;
        color:#fff;
        padding:10px 20px;
        border-radius:5px;
        z-index:9999;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

function setupNavigation() {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

function setupFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            loadProducts(btn.dataset.category || "all");
        });
    });
}

function injectAnimations() {
    if (!document.head) return;
    const style = document.createElement("style");
    style.textContent = `
        .product-card { margin:15px; padding:15px; border:1px solid #ddd; }
        .gallery-item { margin:15px; padding:15px; border:1px solid #eee; }
    `;
    document.head.appendChild(style);
}

})();


