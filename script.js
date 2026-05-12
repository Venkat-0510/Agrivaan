// Loading Screen Animation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderLogo = document.getElementById('loader-logo');
    const navLogo = document.getElementById('nav-logo');

    // 1. Wait for 3 seconds as requested
    setTimeout(() => {
        // 2. Get target position (Navbar Logo)
        const targetRect = navLogo.getBoundingClientRect();
        const loaderRect = loaderLogo.getBoundingClientRect();

        // 3. Calculate scales and translations
        const scaleX = targetRect.width / loaderRect.width;
        const scaleY = targetRect.height / loaderRect.height;
        const translateX = targetRect.left - loaderRect.left + (targetRect.width - loaderRect.width) / 2;
        const translateY = targetRect.top - loaderRect.top + (targetRect.height - loaderRect.height) / 2;

        // 4. Perform the animation
        loaderLogo.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX})`;
        loader.classList.add('opacity-0');
        loader.style.pointerEvents = 'none';

        // 5. Reveal the actual nav logo and remove loader
        setTimeout(() => {
            navLogo.classList.remove('opacity-0');
            loader.style.display = 'none';
        }, 1000); // Matches the 1s duration of the transition

    }, 3000);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

const openMenu = () => {
    mobileMenu.classList.remove('translate-x-full');
    mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
    mobileMenu.classList.add('translate-x-full');
    mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'auto';
};

mobileMenuBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Reveal Animations on Scroll
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.85) {
            el.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Stats Counter Animation
const counters = document.querySelectorAll('.stat-counter');
let counterStarted = false;

const startCounters = () => {
    if (counterStarted) return;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 50; // Speed of counting

        const updateCount = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 40);
            } else {
                counter.innerText = target.toLocaleString() + '+';
            }
        };
        updateCount();
    });
    counterStarted = true;
};

// Start counters when impact section is visible
const impactSection = document.getElementById('impact');
const checkImpact = () => {
    if (!impactSection) return;
    const rect = impactSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
        startCounters();
    }
};

window.addEventListener('scroll', checkImpact);

// Active Link Highlighting (Scroll Spy)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuLinks = document.querySelectorAll('.mobile-link');

const updateActiveState = (id) => {
    // Update Desktop Links
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });

    // Update Mobile Links
    mobileMenuLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
};

const observerOptions = {
    threshold: 0.4,
    rootMargin: "-10% 0px -70% 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateActiveState(entry.target.getAttribute('id'));
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();

            // Immediate UI feedback on click
            updateActiveState(targetId.replace('#', ''));

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (typeof closeMenu === 'function') closeMenu();
        }
    });
});

// Form Submission (Visual Only)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = 'Message Sent Successfully!';
            btn.classList.add('bg-green-600');
            contactForm.reset();

            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('bg-green-600');
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}
