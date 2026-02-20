/**
 * 🌓 THEME ENGINE — Verantwortlich für Theme-Switching (SRP)
 * ===========================================================
 * Zuständigkeiten:
 * - Dark/Light/System Theme umschalten
 * - LocalStorage Persistenz
 * - prefers-color-scheme Media Query Listener
 * - UI Button State aktualisieren
 * ===========================================================
 */

/** @namespace ThemeEngine */
const ThemeEngine = (() => {
    'use strict';

    /* --- Private Variablen --- */
    const HTML_ROOT = document.documentElement;
    const STORAGE_KEY = 'theme';
    const LIGHT_CLASS = 'light-mode';

    /** Referenz auf alle Theme-Toggle-Buttons */
    let buttons = [];

    /* ---------------------------------------------------------------
     * Wendet das gegebene Theme an (Klasse setzen/entfernen)
     * @param {string} mode - 'light' | 'dark' | 'system'
     * --------------------------------------------------------------- */
    function applyTheme(mode) {
        HTML_ROOT.classList.remove(LIGHT_CLASS);

        if (mode === 'light') {
            HTML_ROOT.classList.add(LIGHT_CLASS);
        } else if (mode === 'system') {
            const prefersLight =
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: light)').matches;
            if (prefersLight) {
                HTML_ROOT.classList.add(LIGHT_CLASS);
            }
        }
        // 'dark' → Default, keine Klasse nötig
    }

    /* ---------------------------------------------------------------
     * Aktualisiert den aktiven Zustand der Toggle-Buttons
     * @param {string} activeMode - Das aktuell aktive Theme
     * --------------------------------------------------------------- */
    function updateUI(activeMode) {
        buttons.forEach(btn => {
            const theme = btn.dataset.theme;
            btn.classList.toggle('is-active', theme === activeMode);
        });
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Theme wechseln
     * @param {string} mode - 'light' | 'dark' | 'system'
     * --------------------------------------------------------------- */
    function switchTheme(mode) {
        localStorage.setItem(STORAGE_KEY, mode);
        applyTheme(mode);
        updateUI(mode);
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Initialisierung
     * Liest gespeichertes Theme, wendet es an und registriert Listener
     * --------------------------------------------------------------- */
    function init() {
        buttons = document.querySelectorAll('.theme-toggle__btn');

        const savedTheme = localStorage.getItem(STORAGE_KEY) || 'system';
        applyTheme(savedTheme);
        updateUI(savedTheme);

        // Reagiert auf OS-Level Theme-Änderungen
        window
            .matchMedia('(prefers-color-scheme: light)')
            .addEventListener('change', () => {
                if (localStorage.getItem(STORAGE_KEY) === 'system') {
                    applyTheme('system');
                }
            });
    }

    /* --- Öffentliche API --- */
    return { init, switchTheme };
})();
