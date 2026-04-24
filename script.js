// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        updateThemeButtonText(true);
    } else {
        body.classList.remove('dark-theme');
        updateThemeButtonText(false);
    }
}

// Update theme button text
function updateThemeButtonText(isDark) {
    if (themeToggle) {
        themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    }
}

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDarkTheme = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        updateThemeButtonText(isDarkTheme);
    });
}

// Mobile navigation functionality
function initializeMobileNav() {
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Close mobile menu when clicking a link (for single-page navigation)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // On mobile, smooth scroll to sections
            if (window.innerWidth <= 575) {
                const targetHref = link.getAttribute('href');
                if (targetHref && targetHref.startsWith('#')) {
                    const targetElement = document.querySelector(targetHref);
                    if (targetElement) {
                        const headerOffset = 80; // Account for fixed navbar
                        const elementPosition = targetElement.offsetTop;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
}

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Enhanced smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80; // Account for fixed navbar
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile viewport height fix (for iOS Safari)
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Handle orientation changes
function handleOrientationChange() {
    setTimeout(() => {
        setVH();
        // Recalculate any position-dependent elements
        window.scrollTo(0, 0);
    }, 100);
}

// Touch device optimizations
function initializeTouchOptimizations() {
    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .connect-card, .skill-card, .about-item, .info-card');
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Performance optimizations for mobile
function initializePerformanceOptimizations() {
    // Lazy load images (if any)
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
    }
}

// Scroll-based animations with performance optimization
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for smooth animations
                requestAnimationFrame(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    entry.target.style.opacity = '1';
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.skill-card, .about-item, .connect-card, .info-card, .resume-block, .stat-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Handle window resize events
function handleResize() {
    // Update viewport height on resize
    setVH();

    // Close any open mobile menus if needed
    // Add any other resize-specific logic here
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setActiveNavLink();
    initializeMobileNav();
    initializeTouchOptimizations();
    initializePerformanceOptimizations();
    initializeScrollAnimations();

    // Set initial viewport height
    setVH();
});

// Handle window events
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleOrientationChange);

// Add keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Mobile-specific styles */
    @media (max-width: 575px) {
        .lazy {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .lazy.loaded {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Service Worker registration (for PWA capabilities - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment and create sw.js for PWA functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Error handling for mobile devices
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics service
});

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('Back online');
    // Could show "Back online" notification
});

window.addEventListener('offline', function() {
    console.log('Gone offline');
    // Could show "Offline" notification
});