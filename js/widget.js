/**
 * 🎵 MUSIC WIDGET — Last.fm "Now Playing" Widget (SRP)
 * ===========================================================
 * Zuständigkeiten:
 * - Last.fm API abfragen (aktueller Song + Historie)
 * - Widget-UI updaten (Cover, Titel, Künstler, Album)
 * - Demo-Modus als Fallback
 * - Widget Expand/Collapse
 * - YouTube Music Redirect
 * ===========================================================
 */

/** @namespace MusicWidget */
const MusicWidget = (() => {
    'use strict';

    /* --- Konfiguration --- */
    const CONFIG = {
        apiKey: 'cb97d6a128f56296243dc028e47dfb69',
        user: 'spezialzt',
        pollInterval: 15000,    // 15 Sekunden (API Limit fairness)
        historyLimit: 6         // 1 aktuell + 5 History
    };

    /* --- Demo-Daten (Fallback bei API-Fehler) --- */
    const DEMO_TRACKS = [
        { artist: 'Carpenter Brut', track: 'Turbo Killer', album: 'Trilogy', year: '2015' },
        { artist: 'The Midnight', track: 'Los Angeles', album: 'Days of Thunder', year: '2014' },
        { artist: 'Gunship', track: 'Tech Noir', album: 'Gunship', year: '2015' },
        { artist: 'Perturbator', track: 'Future Club', album: 'Dangerous Days', year: '2014' },
        { artist: 'Kavinsky', track: 'Nightcall', album: 'OutRun', year: '2013' }
    ];

    /* --- DOM Referenzen (werden in init() gesetzt) --- */
    let els = {};
    let isExpanded = false;
    let demoIndex = 0;

    /* ---------------------------------------------------------------
     * Album-Erscheinungsjahr von Last.fm abrufen
     * @param {string} artist - Künstlername
     * @param {string} album - Albumname
     * @returns {Promise<string>} - z.B. "(2015)" oder ""
     * --------------------------------------------------------------- */
    async function fetchAlbumYear(artist, album) {
        if (!artist || !album) return '';
        try {
            const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${CONFIG.apiKey}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.album?.wiki?.published) {
                const match = data.album.wiki.published.match(/\d{4}/);
                return match ? `(${match[0]})` : '';
            }
        } catch { /* stille Fehlerbehandlung */ }
        return '';
    }

    /* ---------------------------------------------------------------
     * Widget-UI aktualisieren (nur wenn sich Track geändert hat)
     * @param {string} label - z.B. "LISTENING NOW"
     * @param {string} track - Songtitel
     * @param {string} artist - Künstler
     * @param {string} album - Album
     * @param {string} year - z.B. "(2015)"
     * @param {string} imgUrl - Cover-Bild URL
     * --------------------------------------------------------------- */
    function updateUI(label, track, artist, album, year, imgUrl) {
        if (els.track.innerText === track) return;

        els.label.innerText = label;
        els.track.innerText = track;
        els.artist.innerText = artist;
        els.album.innerText = album || '';
        els.year.innerText = year || '';

        // Cover Update
        if (imgUrl) {
            els.art.src = imgUrl;
            els.art.onload = () => {
                els.art.style.opacity = '1';
                els.fallback.style.display = 'none';
            };
        } else {
            els.art.style.opacity = '0';
            els.fallback.style.display = 'flex';
        }

        // Marquee Animation Reset
        els.track.classList.remove('animate-marquee');
        void els.track.offsetWidth;     // Reflow erzwingen
        els.track.classList.add('animate-marquee');
    }

    /* ---------------------------------------------------------------
     * History-Liste rendern
     * @param {Array} tracks - Array von Last.fm Track-Objekten
     * --------------------------------------------------------------- */
    function updateHistory(tracks) {
        els.history.innerHTML = '';

        if (!tracks || tracks.length === 0) {
            els.history.innerHTML =
                '<div style="text-align:center;font-size:0.625rem;color:var(--text-faint)">Keine Historie verfügbar</div>';
            return;
        }

        // Header
        const header = document.createElement('div');
        header.style.cssText =
            'font-size:0.5625rem;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;padding:0.25rem;padding-bottom:0.25rem;';
        header.innerText = 'Recently Played';
        els.history.appendChild(header);

        tracks.forEach(t => {
            const div = document.createElement('div');
            div.style.cssText =
                'display:flex;align-items:center;gap:0.5rem;padding:0.375rem;border-radius:var(--radius-md);cursor:pointer;transition:background var(--transition-fast);';
            div.onmouseenter = () => div.style.background = 'rgba(255,255,255,0.05)';
            div.onmouseleave = () => div.style.background = '';
            div.onclick = () => {
                const query = encodeURIComponent(`${t.artist['#text']} ${t.name}`);
                window.open(`https://music.youtube.com/search?q=${query}`, '_blank');
            };

            const imgObj = t.image?.find(img => img.size === 'small') || t.image?.[0];
            const imgUrl = imgObj ? imgObj['#text'] : '';
            const timeStr = t.date
                ? new Date(t.date.uts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '...';

            div.innerHTML = `
                <div style="width:2rem;height:2rem;border-radius:var(--radius-md);background:var(--border-default);flex-shrink:0;overflow:hidden;border:1px solid var(--border-subtle)">
                    ${imgUrl
                        ? `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover" alt="">`
                        : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-music" style="font-size:0.75rem;color:var(--text-faint)"></i></div>'}
                </div>
                <div style="min-width:0;flex:1">
                    <div style="font-size:0.625rem;font-weight:700;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.name}</div>
                    <div style="font-size:0.5625rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.artist['#text']}</div>
                </div>
                <div style="font-size:0.5rem;font-family:var(--font-mono);color:var(--text-faint);white-space:nowrap">${timeStr}</div>
            `;
            els.history.appendChild(div);
        });
    }

    /* ---------------------------------------------------------------
     * Aktuellen Song von Last.fm holen
     * --------------------------------------------------------------- */
    async function fetchNowPlaying() {
        if (!CONFIG.apiKey || CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
            startDemoMode();
            return;
        }

        try {
            const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${CONFIG.user}&api_key=${CONFIG.apiKey}&format=json&limit=${CONFIG.historyLimit}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.recenttracks?.track) throw new Error('Keine Tracks');

            const tracks = data.recenttracks.track;
            const current = tracks[0];

            const isNowPlaying = current['@attr']?.nowplaying === 'true';
            const image = current.image?.find(img => img.size === 'large') || current.image?.[2];

            let year = '';
            if (current.album?.['#text']) {
                year = await fetchAlbumYear(current.artist['#text'], current.album['#text']);
            }

            updateUI(
                isNowPlaying ? 'LISTENING NOW' : 'LAST PLAYED',
                current.name,
                current.artist['#text'],
                current.album?.['#text'] || '',
                year,
                image ? image['#text'] : ''
            );

            updateHistory(tracks.slice(1, 6));
        } catch {
            if (els.track.innerText === 'Lade Daten...') startDemoMode();
        }
    }

    /* ---------------------------------------------------------------
     * Demo-Modus starten (rotierende Synthwave-Tracks)
     * --------------------------------------------------------------- */
    function startDemoMode() {
        setInterval(() => {
            const song = DEMO_TRACKS[demoIndex];
            updateUI('ON ROTATION', song.track, song.artist, song.album, `(${song.year})`, '');
            demoIndex = (demoIndex + 1) % DEMO_TRACKS.length;
        }, 5000);
    }

    /* ---------------------------------------------------------------
     * Widget expandieren / kollabieren
     * --------------------------------------------------------------- */
    function toggleWidget() {
        isExpanded = !isExpanded;
        const icon = document.getElementById('widget-toggle-icon');

        if (isExpanded) {
            els.widget.classList.remove('widget--collapsed');
            els.history.classList.add('is-expanded');
            icon?.classList.replace('fa-chevron-up', 'fa-chevron-down');
        } else {
            els.history.classList.remove('is-expanded');
            els.widget.classList.add('widget--collapsed');
            icon?.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    }

    /* ---------------------------------------------------------------
     * YouTube Music Suche öffnen
     * --------------------------------------------------------------- */
    function openYtMusic() {
        const track = els.track.innerText;
        const artist = els.artist.innerText;
        if (track === 'Lade Daten...' || track === 'Keine Tracks gefunden') return;
        const query = encodeURIComponent(`${artist} ${track}`);
        window.open(`https://music.youtube.com/search?q=${query}`, '_blank');
    }

    /* ---------------------------------------------------------------
     * Öffentlich: Initialisierung
     * --------------------------------------------------------------- */
    function init() {
        els = {
            widget: document.getElementById('status-widget'),
            label: document.getElementById('widget-label'),
            track: document.getElementById('widget-track'),
            artist: document.getElementById('widget-artist'),
            album: document.getElementById('widget-album'),
            year: document.getElementById('widget-year'),
            art: document.getElementById('widget-art'),
            fallback: document.getElementById('widget-art-fallback'),
            history: document.getElementById('widget-history')
        };

        if (!els.widget) return;

        // Sofort laden, dann alle 15s pollen
        fetchNowPlaying();
        setInterval(fetchNowPlaying, CONFIG.pollInterval);
    }

    /* --- Öffentliche API --- */
    return { init, toggleWidget, openYtMusic };
})();
