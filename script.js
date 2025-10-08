// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Cart Functionality
    let cartItems = parseInt(localStorage.getItem('cartItems')) || 0;
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.querySelector('.checkout');
    const modal = document.getElementById('modal');
    const modalCartCount = document.getElementById('modal-cart-count');
    const modalTotal = document.getElementById('modal-total');
    const closeModal = document.querySelector('.close');
    const pricePerItem = 19.99;
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTimer = document.getElementById('cart-timer');
    const cartBadge = document.getElementById('cart-badge');
    let cartReserveTimer;

    function updateCartDisplay() {
        cartCount.textContent = `Items in Cart: ${cartItems}`;
        cartCount.style.display = cartItems > 0 ? 'block' : 'none';
        checkoutBtn.style.display = cartItems > 0 ? 'inline-block' : 'none';
        modalCartCount.textContent = cartItems;
        modalTotal.textContent = `$${(cartItems * pricePerItem).toFixed(2)}`;
        cartBadge.textContent = cartItems;
        cartBadge.style.display = cartItems > 0 ? 'inline' : 'none';
        localStorage.setItem('cartItems', cartItems);
        updateCartSidebar();
    }

    function updateCartSidebar() {
        cartItemsContainer.innerHTML = '';
        if (cartItems > 0) {
            const item = document.createElement('div');
            item.classList.add('cart-item');
            item.innerHTML = `<span>Ultimate Online Course</span><span>$${pricePerItem.toFixed(2)} x ${cartItems}</span>`;
            cartItemsContainer.appendChild(item);
        } else {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        }
        cartTotal.textContent = `$${(cartItems * pricePerItem).toFixed(2)}`;
    }

    window.addToCart = function(openCart = false) {
        cartItems++;
        updateCartDisplay();
        if (openCart) {
            toggleCart();
            startCartReserveTimer();
        }
    };

    window.toggleCart = function() {
        cartSidebar.classList.toggle('open');
        if (cartSidebar.classList.contains('open') && cartItems > 0) {
            startCartReserveTimer();
        } else {
            clearInterval(cartReserveTimer);
        }
    };

    function startCartReserveTimer() {
        clearInterval(cartReserveTimer);
        let timeLeft = 5 * 60; // 5 minutes
        cartTimer.textContent = '05:00';
        cartReserveTimer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            cartTimer.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            if (timeLeft <= 0) {
                clearInterval(cartReserveTimer);
                alert('Your cart reservation has expired.');
                cartItems = 0;
                updateCartDisplay();
                toggleCart();
            }
        }, 1000);
    }

    window.goToCheckout = function() {
        modal.style.display = 'block';
        toggleCart(); // Close cart when going to checkout
    };

    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    window.completePurchase = function() {
        alert('Purchase completed! Thank you for your order. (In a real site, integrate with payment gateway)');
        cartItems = 0;
        updateCartDisplay();
        modal.style.display = 'none';
    };

    updateCartDisplay();

    // Urgency Timer (random between 1-6 hours)
    function startTimer(display) {
        const randomHours = Math.floor(Math.random() * 5) + 1; // 1 to 5 hours
        const randomMinutes = Math.floor(Math.random() * 60);
        let timer = (randomHours * 3600) + (randomMinutes * 60);
        const interval = setInterval(() => {
            const hours = Math.floor(timer / 3600);
            const minutes = Math.floor((timer % 3600) / 60);
            const seconds = timer % 60;
            display.textContent = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            if (--timer < 0) {
                timer = (randomHours * 3600) + (randomMinutes * 60); // Reset to same random time
            }
        }, 1000);
    }

    const timerDisplay = document.getElementById('timer');
    startTimer(timerDisplay);

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        document.querySelector('.hero-bg').style.transform = `translateY(${scrollPosition * 0.5}px)`;
    });

    // Sticky Header
    const header = document.getElementById('header');
    const sticky = header.offsetTop;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > sticky) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Animate on Scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));

    // Social Proof Counters
    function animateCounter(id, start, end, duration) {
        const obj = document.getElementById(id);
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / (end - start)));
        const timer = setInterval(() => {
            current += increment;
            obj.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    animateCounter('students-counter', 0, 10000, 2000);
    animateCounter('reviews-counter', 0, 5000, 2000);
    animateCounter('countries-counter', 0, 50, 2000);
    animateCounter('viewers-counter', 0, Math.floor(Math.random() * 20) + 5, 1000); // Fake live viewers

    // Testimonials Carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.remove('active');
            if (i === index) {
                t.classList.add('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    });

    // Auto-rotate carousel every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);

    // Email Signup Form
    const signupForm = document.getElementById('signup-form');
    const signupMessage = document.getElementById('signup-message');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm.querySelector('input').value;
        if (email) {
            signupMessage.textContent = `Thank you for subscribing with ${email}!`;
            signupForm.reset();
        }
    });

    // Exit Intent Popup
    const exitModal = document.getElementById('exit-modal');
    const exitClose = document.querySelector('.exit-close');
    const discountForm = document.getElementById('discount-form');
    const discountMessage = document.getElementById('discount-message');
    let shown = false;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !shown) {
            shown = true;
            exitModal.style.display = 'block';
        }
    });

    exitClose.onclick = function() {
        exitModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === exitModal) {
            exitModal.style.display = 'none';
        }
    };

    discountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = discountForm.querySelector('input').value;
        if (email) {
            discountMessage.textContent = `10% discount code sent to ${email}! Use code: DISCOUNT10`;
            discountForm.reset();
        }
    });
});
