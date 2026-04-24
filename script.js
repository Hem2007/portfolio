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
                    // Different animations based on element type
                    const elementClass = entry.target.className;

                    if (elementClass.includes('skill-card')) {
                        entry.target.style.animation = 'bounceIn 0.6s ease forwards';
                    } else if (elementClass.includes('connect-card')) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    } else if (elementClass.includes('about-item')) {
                        entry.target.style.animation = 'fadeInLeft 0.6s ease forwards';
                    } else if (elementClass.includes('info-card')) {
                        entry.target.style.animation = 'fadeInRight 0.6s ease forwards';
                    } else {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    }

                    entry.target.style.opacity = '1';
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections with enhanced selectors
    const elementsToAnimate = document.querySelectorAll(
        '.skill-card, .about-item, .connect-card, .info-card, .resume-block, .stat-card, ' +
        '.hero-content h1, .hero-content p, .hero-content .cta-buttons, ' +
        'section h2, .section-subtitle'
    );

    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        // Add staggered delay based on index
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Advanced scroll effects
function initializeScrollEffects() {
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    const navbar = document.querySelector('.navbar');

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollEffects() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Hero image fade effect
        if (heroImage) {
            const fadeStart = 0;
            const fadeEnd = windowHeight * 0.6;
            const scrollProgress = Math.min(scrollY / fadeEnd, 1);

            // Fade out and scale down the image
            const opacity = Math.max(1 - scrollProgress * 1.2, 0);
            const scale = Math.max(1 - scrollProgress * 0.1, 0.9);
            const translateY = scrollProgress * -20;

            heroImage.style.opacity = opacity;
            heroImage.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }

        // Hero content slide effect
        if (heroContent) {
            const slideStart = windowHeight * 0.2;
            const slideProgress = Math.min((scrollY - slideStart) / (windowHeight * 0.4), 1);

            if (slideProgress > 0) {
                const translateX = slideProgress * -30;
                heroContent.style.transform = `translateX(${translateX}px)`;
                heroContent.style.opacity = Math.max(1 - slideProgress * 0.3, 0.7);
            } else {
                heroContent.style.transform = 'translateX(0)';
                heroContent.style.opacity = '1';
            }
        }

        // Navbar background blur effect
        if (navbar) {
            const blurStart = 50;
            if (scrollY > blurStart) {
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.backgroundColor = 'rgba(var(--bg-light-secondary-rgb, 255, 255, 255), 0.95)';
            } else {
                navbar.style.backdropFilter = 'none';
                navbar.style.backgroundColor = 'var(--bg-light-secondary)';
            }
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    // Throttle scroll events for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Hero section initial animations
function initializeHeroAnimations() {
    const heroImage = document.querySelector('.hero-image');
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content .subtitle');
    const heroDescription = document.querySelector('.hero-content .description');
    const heroButtons = document.querySelector('.hero-content .cta-buttons');

    // Set initial states
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'scale(0.8) translateY(20px)';
    }

    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
    }

    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
    }

    if (heroDescription) {
        heroDescription.style.opacity = '0';
        heroDescription.style.transform = 'translateY(30px)';
    }

    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';
    }

    // Animate elements with staggered timing
    setTimeout(() => {
        if (heroImage) {
            heroImage.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'scale(1) translateY(0)';
        }
    }, 200);

    setTimeout(() => {
        if (heroTitle) {
            heroTitle.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }
    }, 400);

    setTimeout(() => {
        if (heroSubtitle) {
            heroSubtitle.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }
    }, 600);

    setTimeout(() => {
        if (heroDescription) {
            heroDescription.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }
    }, 800);

    setTimeout(() => {
        if (heroButtons) {
            heroButtons.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }
    }, 1000);
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
    initializeScrollEffects();
    initializeHeroAnimations();

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