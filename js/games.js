/**
 * 🎮 GAMES GRID — Spiele-Karten Renderer + 3D Tilt (SRP)
 * ===========================================================
 * Zuständigkeiten:
 * - Spiele-Datenbank definieren
 * - Karten dynamisch in das Grid rendern (DRY)
 * - 3D Kipp-Effekt bei Mouseover berechnen
 *
 * ZUKUNFTS-NOTE: Neues Spiel hinzufügen?
 * → Einfach ein Objekt { id: STEAM_ID, name: "Spielname" } in
 *   GAMES eintragen. Die Steam-ID findest du in der Shop-URL:
 *   store.steampowered.com/app/12345/Spielname → ID = 12345
 * ===========================================================
 */

/** @namespace GamesGrid */
const GamesGrid = (() => {
    'use strict';

    /* --- Spiele-Datenbank --- */
    const GAMES = [
        { id: 244850,  name: 'Space Engineers' },
        { id: 553850,  name: 'Helldivers II' },
        { id: 431240,  name: 'Golf With Your Friends' },
        { id: 559650,  name: 'Witch It!' },
        { id: 1484210, name: 'Lockdown Protocol' },
        { id: 427520,  name: 'Factorio' },
        { id: 9350,    name: 'Supreme Commander' },
        { id: 264710,  name: 'Subnautica' },
        { id: 3241660, name: 'R.E.P.O.' },
        { id: 361420,  name: 'Astroneer' },
        { id: 1568590, name: 'Goose Goose Duck' },
        { id: 281990,  name: 'Stellaris' }
    ];

    /** Stärke des Kipp-Effekts in Grad */
    const TILT_STRENGTH = 12;

    /* ---------------------------------------------------------------
     * 3D Kipp-Effekt berechnen und anwenden
     * @param {MouseEvent} e
     * --------------------------------------------------------------- */
    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -TILT_STRENGTH;
        const rotateY = ((x - centerX) / centerX) * TILT_STRENGTH;

        card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    /* ---------------------------------------------------------------
     * Karten-Position zurücksetzen
     * @param {MouseEvent} e
     * --------------------------------------------------------------- */
    function resetTilt(e) {
        e.currentTarget.style.transform =
            'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }

    /* ---------------------------------------------------------------
     * Eine einzelne Spielekarte erstellen
     * @param {Object} game - { id: number, name: string }
     * @returns {HTMLAnchorElement}
     * --------------------------------------------------------------- */
    function createCard(game) {
        const card = document.createElement('a');
        card.href = `https://store.steampowered.com/app/${game.id}`;
        card.target = '_blank';
        card.className = 'tilt-card';
        card.setAttribute('data-reveal', '');

        const imgUrl = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.id}/header.jpg`;

        card.innerHTML = `
            <div class="tilt-card__inner">
                <div class="tilt-card__bg" style="background-image: url('${imgUrl}')">
                    <div class="tilt-card__gradient"></div>
                </div>
            </div>
            <div class="tilt-card__title">
                <h4>${game.name}</h4>
            </div>
            <div class="tilt-card__link-icon">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </div>
        `;

        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);

        return card;
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Initialisierung
     * Rendert alle Spielekarten in das Grid
     * --------------------------------------------------------------- */
    function init() {
        const grid = document.getElementById('games-grid');
        if (!grid) return;

        GAMES.forEach(game => {
            grid.appendChild(createCard(game));
        });
    }

    /* --- Öffentliche API --- */
    return { init };
})();
