// Events Hypernova - Main Script

// --- Page Loader Dismiss ---
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Minimum visible time so it doesn't flash
        setTimeout(() => {
            loader.classList.add('loaded');
            // Remove from DOM after transition ends
            setTimeout(() => loader.remove(), 650);
        }, 600);
    }
});

document.addEventListener('DOMContentLoaded', () => {


    // 0. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // 1. Initialize GSAP ScrollTrigger Animations (Replacing AOS)
    gsap.registerPlugin(ScrollTrigger);

    // Setup an integration between Lenis and ScrollTrigger so they stay in sync
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Fade-up elements
    gsap.utils.toArray('[data-aos="fade-up"]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: element.getAttribute('data-aos-delay') ? parseInt(element.getAttribute('data-aos-delay')) / 1000 : 0
        });
    });

    // Fade-down elements
    gsap.utils.toArray('[data-aos="fade-down"]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Fade-left & Fade-right elements
    const sideFades = [
        { selector: '[data-aos="fade-left"]', x: 50 },
        { selector: '[data-aos="fade-right"]', x: -50 },
        { selector: '[data-aos="zoom-in-left"]', x: 50, scale: 0.9 },
        { selector: '[data-aos="zoom-in-right"]', x: -50, scale: 0.9 },
    ];

    sideFades.forEach(config => {
        gsap.utils.toArray(config.selector).forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                x: config.x,
                scale: config.scale || 1,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
    });

    // Zoom-in elements (like grid cards)
    gsap.utils.toArray('[data-aos="zoom-in"]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: element.getAttribute('data-aos-delay') ? parseInt(element.getAttribute('data-aos-delay')) / 1000 : 0
        });
    });

    // 2. Navbar Scroll Effect
    // Make the navbar sticky and change background when scrolling
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Simple Parallax Effect Hook
    // Drives the floating bubbles based on scroll position
    const bgShapes = document.querySelectorAll('.bg-shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        bgShapes.forEach((shape, index) => {
            // Give each shape a slightly different speed based on index
            const speed = 0.3 + (index * 0.2);
            // Move it downwards as we scroll to create the illusion of depth
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // 4. Auto-Sliding Hero Gallery
    const galleryContainer = document.getElementById('auto-gallery');

    // Only proceed if the gallery exists on the page
    if (galleryContainer) {
        let slideInterval;
        let isTransitioning = false;

        // Function to move to the next slide by manipulating classes and DOM
        const nextSlide = () => {
            if (isTransitioning) return;
            isTransitioning = true;

            // Get current cards in their physical DOM order
            const currentCards = Array.from(galleryContainer.querySelectorAll('.arch-card'));

            // The 1st card (pos-1) collapses/hides
            currentCards[0].classList.remove('pos-1');
            currentCards[0].classList.add('hidden');

            // The 2nd card shifts to pos-1
            currentCards[1].classList.remove('pos-2');
            currentCards[1].classList.add('pos-1');

            // The 3rd card shifts to pos-2 and loses active
            currentCards[2].classList.remove('pos-3', 'active-slide');
            currentCards[2].classList.add('pos-2');

            // The 4th card shifts to pos-3 and becomes active
            currentCards[3].classList.remove('pos-4');
            currentCards[3].classList.add('pos-3', 'active-slide');

            // Change Hero Background Color dynamically!
            const newBgColor = currentCards[3].getAttribute('data-color');
            if (newBgColor) {
                document.getElementById('home').style.backgroundColor = newBgColor;
            }

            // The 5th card shifts to pos-4
            currentCards[4].classList.remove('pos-5');
            currentCards[4].classList.add('pos-4');

            // The 6th card (first hidden one) expands to pos-5
            currentCards[5].classList.remove('hidden');
            currentCards[5].classList.add('pos-5');

            // After the CSS transition completes (600ms), 
            // move the completely collapsed 1st card to the end of the DOM
            // This enables the infinite seamless loop without layout jumps!
            setTimeout(() => {
                galleryContainer.appendChild(currentCards[0]);
                isTransitioning = false;
            }, 600);
        };

        // Start the auto-slider (change every 3 seconds)
        const startSlider = () => {
            slideInterval = setInterval(nextSlide, 3000);
        };

        const stopSlider = () => {
            clearInterval(slideInterval);
        };

        // Initialize slider
        startSlider();

        // Change background immediately on load to match initial pos-3
        const initialActive = galleryContainer.querySelector('.pos-3');
        if (initialActive && initialActive.getAttribute('data-color')) {
            document.getElementById('home').style.backgroundColor = initialActive.getAttribute('data-color');
        }
    }

    // 5. Interactive Image Showcase Logic
    const serviceItems = document.querySelectorAll('#services .staggered-list li');
    const showcaseTitle = document.getElementById('showcase-title');
    const showcaseImg = document.getElementById('showcase-img');
    const showcaseContent = document.querySelector('.showcase-content');

    // Array of beautiful premium event images with diverse color themes
    const serviceImages = [
        "images/service_concept.webp",
        "images/service_realistic_venue.webp",
        "images/service_realistic_decor.webp",
        "images/service_av.webp",
        "images/service_entertainment.webp",
        "images/service_realistic_catering.webp", // Catering Placeholder
        "images/service_realistic_photo.webp", // Photo Placeholder
        "images/service_realistic_branding.webp", // Branding Placeholder
        "images/service_realistic_coordination.webp"  // Coordination Placeholder
    ];

    if (serviceItems.length > 0 && showcaseImg) {
        serviceItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Fade out text content and Image precisely
                showcaseContent.style.opacity = '0';
                showcaseContent.style.transform = 'translateY(10px)';
                showcaseImg.style.opacity = '0';

                setTimeout(() => {
                    // Update Image source
                    showcaseImg.src = serviceImages[index] || serviceImages[0];

                    // Hide the title on hover completely
                    if (showcaseTitle) showcaseTitle.style.display = 'none';

                    const descText = item.getAttribute('data-desc');
                    const descEl = document.getElementById('showcase-desc');
                    if (descEl && descText) {
                        descEl.innerHTML = descText;
                        descEl.style.display = 'block';
                    }

                    // Fade in new content and image
                    showcaseImg.style.opacity = '1';
                    showcaseContent.style.opacity = '1';
                    showcaseContent.style.transform = 'translateY(0)';
                }, 300); // Wait for fade out
            });
        });
    }

    // 6. Initialize Circular Gallery (SwiperJS 3D Coverflow)
    if (typeof Swiper !== 'undefined') {
        new Swiper('.gallery-slider', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            coverflowEffect: {
                rotate: 40,
                stretch: 0,
                depth: 250,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    // 7. Inclusive Toast Logic
    const toastElement = document.getElementById('inclusive-toast');
    const closeToastBtn = document.getElementById('close-toast');

    if (toastElement && closeToastBtn) {
        // Show toast after 3 seconds on initial load
        setTimeout(() => {
            toastElement.classList.add('show');
        }, 3000);

        // Close toast on button click
        closeToastBtn.addEventListener('click', () => {
            toastElement.classList.remove('show');
        });
    }

});
