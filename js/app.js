/**
 * 🚀 APP — Entry Point & Orchestrator
 * ===========================================================
 * Zuständigkeiten:
 * - Alle Module initialisieren (Dependency Injection Style)
 * - Globale Event Listener für Audio-Feedback
 * - Modal-System verwalten
 * - Globale Funktionen für HTML onclick-Attribute bereitstellen
 *
 * SOLID: Open/Closed — neue Module hier registrieren,
 * ohne bestehenden Code zu ändern.
 * ===========================================================
 */

(function App() {
    'use strict';

    /* ---------------------------------------------------------------
     * MODAL SYSTEM
     * Öffnet/Schließt Popup-Fenster anhand ihrer ID
     * --------------------------------------------------------------- */
    function toggleModal(id) {
        const modal = document.getElementById(`modal-${id}`);
        if (!modal) return;

        const isOpen = modal.classList.contains('is-open');
        if (isOpen) {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
        } else {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }
    }

    /* ---------------------------------------------------------------
     * GLOBALE FUNKTIONEN (für HTML onclick-Attribute)
     * --------------------------------------------------------------- */
    window.toggleModal = toggleModal;
    window.switchTheme = (mode) => ThemeEngine.switchTheme(mode);
    window.toggleWidget = () => MusicWidget.toggleWidget();
    window.openYtMusic = () => MusicWidget.openYtMusic();
    window.acceptCookies = () => Effects.acceptCookies();

    /* ---------------------------------------------------------------
     * BOOTSTRAP — Alles starten
     * --------------------------------------------------------------- */
    function bootstrap() {
        // 1. Theme zuerst (vermeidet Flash of Wrong Theme)
        ThemeEngine.init();

        // 2. Feature-Module
        GamesGrid.init();
        MusicWidget.init();
        Effects.init();


    }

    /* --- Los geht's! (requestIdleCallback für TBT-Reduktion) --- */
    const scheduleBootstrap = window.requestIdleCallback
        ? (cb) => requestIdleCallback(cb, { timeout: 2000 })
        : (cb) => setTimeout(cb, 0);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => scheduleBootstrap(bootstrap));
    } else {
        scheduleBootstrap(bootstrap);
    }
})();
