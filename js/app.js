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
            AudioSystem?.play('click');
        } else {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            AudioSystem?.play('open');
        }
    }

    /* ---------------------------------------------------------------
     * GLOBALE FUNKTIONEN (für HTML onclick-Attribute)
     * --------------------------------------------------------------- */
    window.toggleModal = toggleModal;
    window.switchTheme = (mode) => ThemeEngine.switchTheme(mode);
    window.toggleSound = () => AudioSystem.toggle();
    window.toggleWidget = () => MusicWidget.toggleWidget();
    window.openYtMusic = () => MusicWidget.openYtMusic();
    window.acceptCookies = () => Effects.acceptCookies();

    /* ---------------------------------------------------------------
     * AUDIO FEEDBACK FÜR INTERAKTIVE ELEMENTE
     * Hover und Klick-Sounds für Links, Buttons und Karten
     * --------------------------------------------------------------- */
    function attachAudioListeners() {
        document.querySelectorAll('a, button, .tilt-card').forEach(el => {
            el.addEventListener('mouseenter', () => AudioSystem.play('hover'));
            el.addEventListener('click', () => AudioSystem.play('click'));
        });
    }

    /* ---------------------------------------------------------------
     * BOOTSTRAP — Alles starten
     * --------------------------------------------------------------- */
    function bootstrap() {
        // 1. Theme zuerst (vermeidet Flash of Wrong Theme)
        ThemeEngine.init();

        // 2. Audio System
        AudioSystem.init();

        // 3. Feature-Module
        GamesGrid.init();
        MusicWidget.init();
        Terminal.init();
        Effects.init();

        // 4. Audio-Feedback nach kurzem Delay (damit Elemente gerendert sind)
        setTimeout(attachAudioListeners, 500);
    }

    /* --- Los geht's! --- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
