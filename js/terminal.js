/**
 * 🖥️ TERMINAL — Quake-Style Drop-Down Terminal (SRP)
 * ===========================================================
 * Zuständigkeiten:
 * - Terminal öffnen/schließen (F2 / Backquote / Escape)
 * - Befehle registrieren und ausführen (Command Registry)
 * - Command History (Pfeil hoch/runter)
 * - Ausgabe rendern
 *
 * KISS: Command Registry Pattern für einfache Erweiterbarkeit.
 * ===========================================================
 */

/** @namespace Terminal */
const Terminal = (() => {
    'use strict';

    /* --- DOM Referenzen --- */
    let overlay, input, output;

    /* --- Command History --- */
    let history = [];
    let historyIndex = -1;

    /* ---------------------------------------------------------------
     * Command Registry (Key → Handler-Funktion)
     * Neue Befehle einfach hier eintragen.
     * --------------------------------------------------------------- */
    const COMMANDS = {
        help: () => printLine(`Available commands:
  <span style="color:#fff">whoami</span>     - Display user bio
  <span style="color:#fff">contact</span>    - Show contact details
  <span style="color:#fff">games</span>      - List favorite games
  <span style="color:#fff">skills</span>     - List technical skills
  <span style="color:#fff">clear</span>      - Clear terminal screen
  <span style="color:#fff">exit</span>       - Close terminal
  <span style="color:#fff">sudo</span>       - Execute as superuser`),

        whoami: () => printLine(`User: Tobias Boyke (Mr. Riös)
Role: Paratrooper Officer & Fullstack Developer
Status: <span style="color:#4ade80">ONLINE</span>
Quote: "Führen durch Vorbild."`),

        contact: () => printLine(`E-Mail: Tobias.Boyke+admin@gmail.com
GitHub: github.com/T-Boyke
Steam: mr-rioes`),

        games: () => printLine(`Favorites:
- EVE Online (21k hrs)
- Factorio (The Factory Must Grow)
- Helldivers 2 (For Democracy!)
- Space Engineers`),

        skills: () => printLine(`- C# / .NET 8/9
- Angular 17+
- Tailwind CSS
- Leadership (Lvl 100)`),

        clear: () => { output.innerHTML = ''; },

        exit: () => toggleTerminal(),

        sudo: () => {
            printLine('<span style="color:#ef4444">PERMISSION DENIED. Nice try, script kiddy.</span>');
            AudioSystem?.play('click');
        },

        matrix: () => {
            printLine('The Matrix has you...');
            if (typeof Effects !== 'undefined') Effects.startMatrix();
            toggleTerminal();
        }
    };

    /* ---------------------------------------------------------------
     * Zeile in den Terminal-Output schreiben
     * @param {string} html - HTML-Inhalt der Zeile
     * --------------------------------------------------------------- */
    function printLine(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    /* ---------------------------------------------------------------
     * Befehl ausführen
     * @param {string} cmdStr - Roher Eingabetext
     * --------------------------------------------------------------- */
    function executeCommand(cmdStr) {
        const args = cmdStr.split(' ');
        const cmd = args[0].toLowerCase();

        // Echo des eingegebenen Befehls
        printLine(`<span style="color:var(--color-neon-pink)">visitor@mr-rioes:~$</span> ${cmdStr}`);

        // Befehl nachschlagen und ausführen
        if (COMMANDS[cmd]) {
            COMMANDS[cmd](args);
        } else {
            printLine(`<span style="color:#f87171">Command not found: ${cmd}</span>`);
        }

        AudioSystem?.play('hover');
    }

    /* ---------------------------------------------------------------
     * Terminal öffnen / schließen
     * --------------------------------------------------------------- */
    function toggleTerminal() {
        overlay.classList.toggle('is-open');
        if (overlay.classList.contains('is-open')) {
            input.focus();
            AudioSystem?.play('open');
        } else {
            input.blur();
            AudioSystem?.play('click');
        }
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Initialisierung
     * --------------------------------------------------------------- */
    function init() {
        overlay = document.getElementById('terminal-overlay');
        input = document.getElementById('terminal-input');
        output = document.getElementById('terminal-output');

        if (!overlay || !input || !output) return;

        // Tastatur-Shortcut für Terminal Toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === '^' || e.key === '°' || e.code === 'Backquote' || e.key === 'F2') {
                e.preventDefault();
                toggleTerminal();
            }
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
                toggleTerminal();
            }
        });

        // Enter → Befehl ausführen, Pfeiltasten → History
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (cmd) {
                    executeCommand(cmd);
                    history.push(cmd);
                    historyIndex = history.length;
                    input.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = history[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    input.value = history[historyIndex];
                } else {
                    historyIndex = history.length;
                    input.value = '';
                }
            }
        });
    }

    /* --- Öffentliche API --- */
    return { init, toggleTerminal };
})();
