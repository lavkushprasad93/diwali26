# Diwali Celebration — React + Vite

An interactive Diwali-themed single-page website featuring an immersive CSS Diwali hallway, a tap-to-light diya with a personal greeting, a private, in-browser personalized Diwali photo maker, simulated fireworks, Pixabay sound effects, custom firework colours, and shareable wishes.

## Requirements
- Node.js 18 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
diwali-celebration/
├── public/
├── src/
│   ├── components/
│   │   ├── DiwaliScene.jsx
│   │   ├── DiwaliPhotoMaker.jsx
│   │   ├── Diya.jsx
│   │   └── FireworksCanvas.jsx
│   ├── utils/
│   │   └── sounds.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Notes
- The interactive Diwali home, rangoli, and fireworks are visual simulations; no real pyrotechnics are involved.
- The Diwali photo maker creates a downloadable greeting image entirely in your browser. The name is required, the photo is optional, and neither is uploaded.
- The greeting maker cycles through three festive templates and avoids repeating the last selected design; the entered name is emphasized on the final image.
- Firecracker sounds are bundled as local MP3 files from Pixabay and mapped to individual firecrackers.
- Selecting a firecracker opens a full-screen night-sky display with a firework tray; each type has its own animation and sound. Use Back to celebration to return to the home scene.
- Refreshing the page returns to the opening scene.
- Phuljhadi plays the requested Pixabay sound with a sustained golden fountain of upward-flying sparks.
- Firecracker visuals are distinct: rockets climb and burst, Anar and Phuljhadi spray sparks, Chakri spins, Ladi crackles in sequence, Bomb sends out a shockwave, and Skyshot launches a trio of colorful bursts. The tray also has a Light them all sequence.
- Developed by Lavkush Prasad.
- Browsers generally require a user interaction before audio can play.
- The visuals are built with CSS and Canvas; no external image assets are required.

## Sound effect sources

The bundled effects are by [freesound_community on Pixabay](https://pixabay.com/users/freesound_community-46691455/):

| Firecracker | Sound | Pixabay source |
| --- | --- | --- |
| Rocket | Firecracker | [Sound effect 106974](https://pixabay.com/sound-effects/film-special-effects-firecracker-106974/) |
| Anar | Firework buzz | [Sound effect 107785](https://pixabay.com/sound-effects/film-special-effects-buzzingbeefirework1-107785/) |
| Chakri | Firework buzz | [Sound effect 107785](https://pixabay.com/sound-effects/film-special-effects-buzzingbeefirework1-107785/) |
| Ladi | Firecrackers | [Sound effect 178799](https://pixabay.com/sound-effects/film-special-effects-firecrackers-178799/) |
| Bomb | Bang | [Sound effect 100662](https://pixabay.com/sound-effects/film-special-effects-bang-100662/) |
| Phuljhadi | Firecrackers | [Sound effect 423766](https://pixabay.com/sound-effects/film-special-effects-firecrackers-423766/) |
| Skyshot | Urban fireworks | [Sound effect 461311](https://pixabay.com/sound-effects/sound-of-fireworks-in-urban-areas-461311/) |

The original effects are trimmed during playback to keep them in sync with the on-screen bursts.
