/* ============================================
   Navigation & Interactions
   ============================================ */
(function () {
    'use strict';

    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link[data-section]');
    var currentYear = document.getElementById('currentYear');
    var scrollProgress = document.getElementById('scrollProgress');

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function getNavHeight() {
        return isMobile() ? 60 : 72;
    }

    /* --- Scroll Progress Indicator --- */
    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    /* --- Navbar scroll shadow --- */
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile hamburger & overlay --- */
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
        var isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            hamburger.classList.add('active');
            navMenu.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    overlay.addEventListener('click', closeMenu);

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    });

    /* --- Scroll spy --- */
    var sections = [];
    navLinks.forEach(function (link) {
        var id = link.getAttribute('data-section');
        var section = document.getElementById(id);
        if (section) sections.push({ link: link, section: section });
    });

    function setActiveLink() {
        var scrollY = window.scrollY;
        var current = '';
        var offset = getNavHeight() + 50;

        sections.forEach(function (item) {
            if (item.section.offsetTop - offset <= scrollY) {
                current = item.section.id;
            }
        });

        navLinks.forEach(function (link) {
            var sectionId = link.getAttribute('data-section');
            if (sectionId === current) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /* --- Smooth scroll offset --- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var top = target.offsetTop - getNavHeight() - 16;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', setActiveLink);

    /* --- IntersectionObserver for scroll animations --- */
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    var animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* --- Copyright year --- */
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* --- Initial checks --- */
    if (window.scrollY > 10) navbar.classList.add('scrolled');
    setActiveLink();
})();
