(function () {
    'use strict';

    var nav = document.getElementById('nav');
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    var navLinkItems = document.querySelectorAll('.nav-link[data-section]');
    var currentYear = document.getElementById('currentYear');
    var scrollProgress = document.getElementById('scrollProgress');

    function getNavHeight() {
        return window.innerWidth <= 768 ? 72 : 84;
    }

    /* --- Scroll Progress --- */
    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = ((scrollTop / docHeight) * 100) + '%';
    });

    /* --- Nav shrink on scroll --- */
    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    /* --- Mobile menu --- */
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
        if (navLinks.classList.contains('open')) {
            closeMenu();
        } else {
            hamburger.classList.add('active');
            navLinks.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    overlay.addEventListener('click', closeMenu);

    navLinkItems.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navLinks.classList.contains('open')) closeMenu();
        });
    });

    /* --- Scroll spy --- */
    var sections = [];
    navLinkItems.forEach(function (link) {
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

        navLinkItems.forEach(function (link) {
            var sectionId = link.getAttribute('data-section');
            link.classList.toggle('active', sectionId === current);
        });
    }

    /* --- Smooth scroll --- */
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
    var animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* --- Hero parallax effects --- */
    (function () {
        var hero = document.querySelector('.hero');
        if (!hero) return;
        var orbs = hero.querySelectorAll('.hero-orb');
        var particles = hero.querySelectorAll('.hero-particle');

        /* Scroll-based parallax */
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var heroBottom = hero.offsetTop + hero.offsetHeight;
            if (scrollY > heroBottom) return;
            var progress = Math.min(scrollY / (hero.offsetHeight * 0.5), 1);

            orbs.forEach(function (orb, i) {
                var factor = (i + 1) * 0.06;
                var current = orb.style.transform || '';
                if (current.indexOf('translateY') === -1) {
                    orb.style.transform = 'translateY(' + (progress * 30 * factor) + 'px)';
                }
            });

            particles.forEach(function (p, i) {
                var factor = (i + 1) * 0.04;
                var current = p.style.transform || '';
                if (current.indexOf('translateY') === -1) {
                    p.style.transform = 'translateY(' + (progress * -25 * factor) + 'px)';
                }
            });
        });

        /* Mouse-based parallax for orbs */
        document.addEventListener('mousemove', function (e) {
            var heroRect = hero.getBoundingClientRect();
            if (e.clientY < heroRect.top || e.clientY > heroRect.bottom) return;
            var xFactor = (e.clientX / window.innerWidth - 0.5) * 2;
            var yFactor = (e.clientY / window.innerHeight - 0.5) * 2;

            orbs.forEach(function (orb, i) {
                var depth = (i + 1) * 4;
                orb.style.transform = 'translate(' + (xFactor * depth) + 'px, ' + (yFactor * depth) + 'px)';
            });
        });
    })();

    /* --- Copyright year --- */
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    setActiveLink();

    /* --- Hero card initial stagger animation --- */
    var heroCards = document.querySelectorAll('.hero-card');
    heroCards.forEach(function (card, i) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(function () {
            card.style.transition = 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (i * 120));
    });

    /* --- Back to Top --- */
    var backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
