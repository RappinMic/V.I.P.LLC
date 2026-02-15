// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.init();
    }

    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('vip-art-gallery-cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.currentTarget.getAttribute('data-name');
                const price = parseFloat(e.currentTarget.getAttribute('data-price'));
                this.addItem(name, price);
                this.showAddedToCartAnimation(e.currentTarget);
            });
        });

        // Cart modal controls
        document.querySelector('.cart-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.openCart();
        });

        document.querySelector('.close-cart').addEventListener('click', () => {
            this.closeCart();
        });

        // Close cart when clicking outside
        document.querySelector('.cart-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-modal')) {
                this.closeCart();
            }
        });

        // Checkout button
        document.querySelector('.checkout-button').addEventListener('click', () => {
            this.checkout();
        });

        // Smooth scroll for navigation
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#cart') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    addItem(name, price) {
        // Check if item already exists
        const existingItem = this.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('vip-art-gallery-cart', JSON.stringify(this.items));
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items display
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = this.items.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');

            // Attach remove button listeners
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.getAttribute('data-index'));
                    this.removeItem(index);
                });
            });
        }

        // Update total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    openCart() {
        document.querySelector('.cart-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        document.querySelector('.cart-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    showAddedToCartAnimation(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 1500);
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemsList = this.items.map(item => 
            `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        alert(`Thank you for your order!\n\nOrder Summary:\n${itemsList}\n\nTotal: $${total.toFixed(2)}\n\nThis is a demo checkout. In a real store, you would be redirected to a payment processor.`);

        // Clear cart after checkout
        this.items = [];
        this.saveCart();
        this.updateCartUI();
        this.closeCart();
    }
}

// Scroll animations for elements
class ScrollAnimations {
    constructor() {
        this.observeElements();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe animated boxes
        document.querySelectorAll('.animated-box').forEach(element => {
            observer.observe(element);
        });
    }
}

// Background color shifting effect
class ColorShift {
    constructor() {
        this.colors = [
            'linear-gradient(135deg, #E8B4B8 0%, #D4A574 50%, #A6B8A1 100%)',
            'linear-gradient(135deg, #A6B8A1 0%, #8B7D9B 50%, #E8B4B8 100%)',
            'linear-gradient(135deg, #D4A574 0%, #C77B5C 50%, #8B7D9B 100%)'
        ];
        this.currentIndex = 0;
    }

    start() {
        const hero = document.querySelector('.hero');
        if (hero) {
            setInterval(() => {
                this.currentIndex = (this.currentIndex + 1) % this.colors.length;
                hero.style.background = this.colors[this.currentIndex];
            }, 10000);
        }
    }
}

// Interactive product card effects
class ProductEffects {
    constructor() {
        this.addHoverEffects();
    }

    addHoverEffects() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const icon = e.currentTarget.querySelector('.product-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });

            card.addEventListener('mouseleave', (e) => {
                const icon = e.currentTarget.querySelector('.product-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
}

// Gallery item rotation effect
class GalleryEffects {
    constructor() {
        this.addGalleryHover();
    }

    addGalleryHover() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const image = e.currentTarget.querySelector('.gallery-image');
                if (image) {
                    image.style.transform = 'rotate(360deg)';
                    image.style.transition = 'transform 0.6s ease';
                }
            });

            item.addEventListener('mouseleave', (e) => {
                const image = e.currentTarget.querySelector('.gallery-image');
                if (image) {
                    image.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize shopping cart
    const cart = new ShoppingCart();

    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();

    // Initialize color shift effect
    const colorShift = new ColorShift();
    colorShift.start();

    // Initialize product effects
    const productEffects = new ProductEffects();

    // Initialize gallery effects
    const galleryEffects = new GalleryEffects();

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add fade-in animation to sections on scroll
    const sections = document.querySelectorAll('section');
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fade-in-up 0.8s ease-out forwards';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        fadeInObserver.observe(section);
    });

    console.log('V.I.P. Art Gallery & Apparel Store - Initialized');
    console.log('Picasso-inspired theme loaded successfully!');
});

// Prevent default form submissions (if any forms are added)
document.addEventListener('submit', (e) => {
    e.preventDefault();
});
