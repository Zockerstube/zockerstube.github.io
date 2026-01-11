# 🕹️ Die Zockerstube (Mr.Riös)

Willkommen im Maschinenraum meiner persönlichen Website!
Dieses Repository ist das Zuhause von `https://mr.rioes.de` (oder wo auch immer sie gerade läuft).

Dies ist kein gewöhnliches Portfolio. Dies ist ein **Cyberpunk-Spielplatz**, gebaut um Spaß zu machen, gut auszusehen und meine Liebe zu Retro-Games, Code & Design zu zeigen.

---

## 🏗️ Architektur & Technologie

Dieses Projekt wurde mit dem **"Keep it Simple, Stupid" (KISS)** Prinzip gebaut, aber mit einem modernen Anstrich. Keine riesigen Frameworks, kein Build-Step (außer du willst es), einfach pure Web-Power.

### Der Tech-Stack
| Technologie | Warum? |
|Text|Beschreibung|
|---|---|
| **HTML5** | Das Skelett. Semantisch korrekt (meistens) und solide. |
| **Tailwind CSS v4** | Das Styling. Wir laden es direkt via CDN für schnelle Prototypen. *Hinweis: In einer echten Produktion würde man das builden, aber für diese Seite reicht die CDN Version völlig.* |
| **Vanilla JS** | Die Logik. Kein React, kein Vue, kein Angular. Nur reines JavaScript. Das bedeutet: Diese Seite wird auch in 10 Jahren noch laufen, ohne dass du `npm install` reparieren musst. |
| **FontAwesome** | Die Icons. Alles was du an kleinen Bildchen siehst (Steam Logo, Twitch etc.). |
| **Google Fonts** | `Press Start 2P` für Retro-Feeling, `Inter` für Lesbarkeit, `Courier Prime` für Code-Optik. |

---

## 🎨 Design-Philosophie

Das Design folgt einem **"Neon-Noir / Cyberpunk"** Thema.
- **Farben:** Wir nutzen CSS-Variablen (`:root`), um Farben zentral zu steuern.
  - `Neon Blue` (#00FFFF): Für aktive Elemente und Highlights.
  - `Neon Purple` (#bd00ff): Für Akzente und "Magie".
  - `Dark / Zinc`: Für den Hintergrund (nicht pures Schwarz, das ist zu hart).
- **Bewegung:** Alles soll "leben". Buttons leuchten, Karten kippen (Tilt-Effekt), Hintergründe scannen.
- **Glassmorphism:** Halb-transparente Container ("Frosted Glass") geben Tiefe.

---

## 🚀 Installation & Nutzung

Du willst an der Seite basteln? Easy.

1. **Repository klonen** (oder runterladen).
2. **`index.html` öffnen**. Einfach im Browser doppelklicken. Fertig.

Es ist kein Server nötig, keine Datenbank, nichts. Es ist eine statische Seite.

---

## 🛠️ Anpassungs-Guide (Für dein Zukunfts-Ich)

Hier ist dein Spickzettel, wenn du in 5 Jahren vergessen hast, wie alles geht.

### 1. Neue Spiele hinzufügen
Suche im Code (`index.html`) nach dem Bereich `const games = [...]`.
Dort ist eine Liste. Füge einfach eine Zeile hinzu:
```javascript
{ id: 123456, name: "Neues Spiel" },
```
Die `id` ist die **Steam App ID**. Die findest du, wenn du das Spiel im Steam-Shop aufrufst, oben in der URL.

### 2. Links ändern (Social Media)
Suche im HTML (ziemlich weit unten im `<footer>`) nach den `<a>` Tags. Ändere einfach das `href="..."`.

### 3. Last.fm API Key
Damit die Musik-Anzeige ("Listening to...") funktioniert, brauchst du einen API Key.
Suche im Code nach `const API_KEY = '...'`.
Wenn du keinen hast: Gehe auf [last.fm/api](https://www.last.fm/api), erstelle einen "API Account" und kopiere den Key dort rein.

### 4. Farben ändern
Ganz oben im `<head>` Bereich, im `<style>` Block, findest du `:root`.
Ändere dort einfach die Hex-Codes (z.B. `--color-neon-blue: #...`) und die ganze Seite färbt sich um.

---

## 📂 Struktur

- `index.html`: **Alles**. Ja wirklich. Struktur, Styles (im Head) und Logik (unten im Body). Warum? Weil es so einfacher ist, alles im Blick zu haben.
- `assets/`: Bilder (Favicon, Logo falls vorhanden).

---

## ⚠️ Bekannte "Eigenheiten" (Features, not Bugs)

- **Der 3D-Kipp-Effekt:** Berechnet die Mausposition relativ zur Mitte der Karte. Kann auf Handys manchmal komisch aussehen (da kein Hover), ist aber okay.
- **Tailwind CDN:** Beim allerersten Laden kann es kurz "flackern" (FOUC), bis Tailwind geladen ist. Das ist der Preis für die Einfachheit ohne Build-Tool.

---

*Coded with ❤️, caffeine and heavy synthwave music.*
*Mr.Riös / 2026*
