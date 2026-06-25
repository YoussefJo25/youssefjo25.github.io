// Initialize Lucide Icons
lucide.createIcons();
// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
    // Mobile Hamburger Menu Logic
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navToggleIcon = navToggle.querySelector('i');
    function closeMenu() {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggleIcon.classList.remove('fa-xmark');
        navToggleIcon.classList.add('fa-bars');
    }
    function openMenu() {
        navLinks.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggleIcon.classList.remove('fa-bars');
        navToggleIcon.classList.add('fa-xmark');
    }
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    // Close the menu after tapping a nav link (but not the theme toggle button)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    // Close the menu if the viewport grows back to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
    // Close the menu when tapping outside of it
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navLinks.contains(e.target) || navToggle.contains(e.target);
        if (!isClickInsideNav && navLinks.classList.contains('open')) {
            closeMenu();
        }
    });
    // Book Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookCards = document.querySelectorAll('.book-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            bookCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
    // Certificate Filtering Logic
    const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('#certificates .book-card');
    certFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            certFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-cert-filter');
            certCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-cert-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
});
