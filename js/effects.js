/**
 * ✨ EFFECTS — Easter Eggs und visuelle Effekte (SRP)
 * ===========================================================
 * Zuständigkeiten:
 * - Konami Code Erkennung + Konfetti
 * - Matrix Rain Canvas Animation
 * - Cursor Spotlight
 * - Cookie Banner Logik
 * - Scroll Reveal (IntersectionObserver)
 * - Sticky Nav Visibility
 * ===========================================================
 */

/** @namespace Effects */
const Effects = (() => {
    'use strict';

    /* ---------------------------------------------------------------
     * 🤫 KONAMI CODE
     * Sequenz: ↑ ↑ ↓ ↓ ← → ← → B A
     * --------------------------------------------------------------- */
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    /**
     * Einzelnen Konfetti-Schnipsel erzeugen
     */
    function createConfetti() {
        const el = document.createElement('div');
        el.classList.add('confetti');
        el.style.left = Math.random() * 100 + 'vw';
        el.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        el.style.animationDuration = Math.random() * 3 + 2 + 's';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 5000);
    }

    /**
     * Konami-Modus aktivieren: 50 Konfetti + Puls
     */
    function activateKonami() {
        for (let i = 0; i < 50; i++) createConfetti();
        document.body.style.animation = 'pulse-glow 1s ease';
        setTimeout(() => document.body.style.animation = '', 1000);
    }

    /**
     * Konami Key Listener einrichten
     */
    function initKonami() {
        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode()) {
                konamiIndex++;
                if (konamiIndex === KONAMI.length) {
                    activateKonami();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    /** Aktuell erwartete Taste */
    function konamiCode() { return KONAMI[konamiIndex]; }


    /* ---------------------------------------------------------------
     * 💡 CURSOR SPOTLIGHT
     * --------------------------------------------------------------- */
    function initSpotlight() {
        const spotlight = document.getElementById('spotlight');
        if (!spotlight) return;

        let rafId = null;

        document.addEventListener('mousemove', (e) => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                spotlight.style.setProperty('--x', `${x}%`);
                spotlight.style.setProperty('--y', `${y}%`);
                spotlight.classList.add('is-active');
                rafId = null;
            });
        }, { passive: true });
    }

    /* ---------------------------------------------------------------
     * 🍪 COOKIE BANNER
     * --------------------------------------------------------------- */
    function initCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (!banner) return;

        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                banner.classList.add('is-visible');
            }
        }, 1000);
    }

    /**
     * Cookies akzeptieren (aufgerufen vom HTML onclick)
     */
    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'true');
        const banner = document.getElementById('cookie-banner');
        banner?.classList.remove('is-visible');
    }

    /* ---------------------------------------------------------------
     * ✨ SCROLL REVEAL (IntersectionObserver)
     * --------------------------------------------------------------- */
    function initScrollReveal() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        document.querySelectorAll('[data-reveal]').forEach(el => {
            observer.observe(el);
        });
    }

    /* ---------------------------------------------------------------
     * 🧭 STICKY NAV Visibility
     * --------------------------------------------------------------- */
    function initStickyNav() {
        const nav = document.getElementById('site-nav');
        if (!nav) return;

        let lastScroll = 0;
        const threshold = 200;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > threshold) {
                nav.classList.add('is-visible');
            } else {
                nav.classList.remove('is-visible');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Initialisierung
     * --------------------------------------------------------------- */
    function init() {
        initKonami();
        initSpotlight();
        initCookieBanner();
        initStickyNav();

        // Scroll Reveal nach kurzem Delay (damit Loading-Screen fertig ist)
        setTimeout(initScrollReveal, 200);
    }

    /* --- Öffentliche API --- */
    return { init, acceptCookies };
})();
