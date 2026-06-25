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

// Builds the HTML for a single book card from a book data object
function buildBookCardHTML(book) {
    const infoClass = book.isArabic ? 'book-info arabic-text' : 'book-info';
    const dirAttr = book.isArabic ? ' dir="rtl"' : '';
    const coverSrc = encodeURI(book.cover);
    const pdfHref = encodeURI(book.pdf);

    return `
        <div class="book-card fade-in" data-category="${book.category}">
            <a href="${pdfHref}" target="_blank" class="book-link">
                <div class="book-cover">
                    <img src="${coverSrc}" alt="${book.title}">
                </div>
                <div class="${infoClass}">
                    <h3${dirAttr}>${book.title}</h3>
                    <p${dirAttr}>${book.author}</p>
                </div>
            </a>
        </div>
    `;
}

// Builds the HTML for a single certificate card from a certificate data object
function buildCertificateCardHTML(cert) {
    const coverSrc = encodeURI(cert.cover);
    const fileHref = encodeURI(cert.file);

    return `
        <div class="book-card fade-in" data-cert-category="${cert.category}">
            <a href="${fileHref}" target="_blank" class="book-link">
                <div class="book-cover">
                    <img src="${coverSrc}" alt="${cert.title}">
                </div>
                <div class="book-info">
                    <h3>${cert.title}</h3>
                    <p>${cert.issuer}</p>
                </div>
            </a>
        </div>
    `;
}

// Loads certificates.json and renders all certificate cards into #certificates-grid
async function loadCertificates() {
    const certificatesGrid = document.getElementById('certificates-grid');
    if (!certificatesGrid) return;

    try {
        const response = await fetch('certificates.json');
        if (!response.ok) throw new Error('Failed to load certificates.json');
        const certificates = await response.json();

        if (certificates.length === 0) {
            certificatesGrid.innerHTML = '<p style="color: var(--color-text-secondary);">لسه مفيش شهادات مضافة.</p>';
            return;
        }

        certificatesGrid.innerHTML = certificates.map(buildCertificateCardHTML).join('');
    } catch (error) {
        console.error('Error loading certificates:', error);
        certificatesGrid.innerHTML = '<p style="color: var(--color-text-secondary);">تعذّر تحميل الشهادات.</p>';
        return;
    }

    // Re-observe fade-in animation for the newly created certificate cards
    certificatesGrid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Initialize filtering now that the certificate cards actually exist in the DOM
    initCertificateFiltering();
}

// Certificate Filtering Logic (re-runnable after certificates are dynamically loaded)
function initCertificateFiltering() {
    const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
    const certCards = document.querySelectorAll('#certificates-grid .book-card');

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
}

// Loads books.json and renders all book cards into #books-grid
async function loadBooks() {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;

    try {
        const response = await fetch('books.json');
        if (!response.ok) throw new Error('Failed to load books.json');
        const books = await response.json();

        booksGrid.innerHTML = books.map(buildBookCardHTML).join('');
    } catch (error) {
        console.error('Error loading books:', error);
        booksGrid.innerHTML = '<p style="color: var(--color-text-secondary);">تعذّر تحميل قائمة الكتب.</p>';
        return;
    }

    // Re-observe fade-in animation for the newly created book cards
    booksGrid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Initialize filtering now that the book cards actually exist in the DOM
    initBookFiltering();
}

// Book Filtering Logic (re-runnable after books are dynamically loaded)
function initBookFiltering() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Load books dynamically from books.json
    loadBooks();

    // Load certificates dynamically from certificates.json
    loadCertificates();

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
});
