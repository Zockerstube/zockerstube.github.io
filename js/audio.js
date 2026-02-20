/**
 * 🔊 AUDIO SYSTEM — Web Audio API Synthese (SRP)
 * ===========================================================
 * Zuständigkeiten:
 * - Cyberpunk/Sci-Fi Sounds per Web Audio API erzeugen
 * - Sound-Präferenz per LocalStorage speichern
 * - UI Toggle aktualisieren
 *
 * Erzeugt Sounds dynamisch (Synthese), keine externen Dateien.
 * ===========================================================
 */

/** @namespace AudioSystem */
const AudioSystem = (() => {
    'use strict';

    /* --- Private Variablen --- */
    const STORAGE_KEY = 'soundEnabled';
    let ctx = null;
    let enabled = false;

    /* ---------------------------------------------------------------
     * Sound-Definitionen (Typ → Oszillator-Konfiguration)
     * --------------------------------------------------------------- */
    const SOUNDS = {
        /**
         * Kurzes, hohes "Tick" für Hover-Events
         * @param {AudioContext} ctx
         * @param {number} now
         */
        hover(ctx, now) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        },

        /**
         * Bestätigungs-"Bloop" für Klick-Events
         * @param {AudioContext} ctx
         * @param {number} now
         */
        click(ctx, now) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        },

        /**
         * High-Tech Swell für Modal/Terminal öffnen
         * @param {AudioContext} ctx
         * @param {number} now
         */
        open(ctx, now) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.2);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    };

    /* ---------------------------------------------------------------
     * Erstellt den AudioContext (Browser Policy erfordert User-Geste)
     * --------------------------------------------------------------- */
    function ensureContext() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    /* ---------------------------------------------------------------
     * Aktualisiert das Sound-Toggle-Button-Icon
     * --------------------------------------------------------------- */
    function updateUI() {
        const btn = document.getElementById('btn-sound');
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (enabled) {
            icon.className = 'fa-solid fa-volume-high text-neon-blue';
            btn.style.color = 'var(--color-neon-blue)';
        } else {
            icon.className = 'fa-solid fa-volume-xmark';
            btn.style.color = '';
        }
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Sound abspielen
     * @param {string} type - 'hover' | 'click' | 'open'
     * --------------------------------------------------------------- */
    function play(type) {
        if (!enabled || !SOUNDS[type]) return;
        ensureContext();
        SOUNDS[type](ctx, ctx.currentTime);
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Sound an/aus umschalten
     * --------------------------------------------------------------- */
    function toggle() {
        enabled = !enabled;
        localStorage.setItem(STORAGE_KEY, enabled);
        updateUI();
        if (enabled) {
            ensureContext();
            play('click');
        }
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Initialisierung
     * --------------------------------------------------------------- */
    function init() {
        const pref = localStorage.getItem(STORAGE_KEY);
        enabled = pref === 'true';
        updateUI();

        // AudioContext erst bei erster Interaktion (Browser Policy)
        document.addEventListener('click', () => {
            if (enabled && !ctx) ensureContext();
        }, { once: true });
    }

    /* --- Öffentliche API --- */
    return { init, play, toggle };
})();
