import { useMemo, useState } from "react";
import {
  Volume2, VolumeX, Moon, Sun, Sparkles, Flame,
  Copy, Share2, WandSparkles, RotateCcw
} from "lucide-react";
import FireworksCanvas from "./components/FireworksCanvas.jsx";
import Diya from "./components/Diya.jsx";
import DiwaliScene from "./components/DiwaliScene.jsx";
import DiwaliPhotoMaker from "./components/DiwaliPhotoMaker.jsx";
import { playFireworkSound } from "./utils/sounds.js";

const crackers = [
  { id: "rocket", name: "Rocket", emoji: "🚀", desc: "A rising trail and sky burst", count: 110, power: 1.2, color: "#77d9ff" },
  { id: "anar", name: "Anar", emoji: "🎆", desc: "A wide golden fountain", count: 120, power: 0.8, color: "#ffd166" },
  { id: "chakri", name: "Chakri", emoji: "🌀", desc: "A spinning wheel of sparks", count: 95, power: 1, color: "#ff58c7" },
  { id: "ladi", name: "Ladi", emoji: "🧨", desc: "A fast chain of crackling bursts", count: 65, power: 0.8, color: "#ff9d48" },
  { id: "bomb", name: "Bomb", emoji: "💥", desc: "A powerful burst and shockwave", count: 170, power: 1.45, color: "#ff5656" },
  { id: "phuljhadi", name: "Phuljhadi", emoji: "✨", desc: "A steady spray of golden sparks", count: 85, power: 0.55, color: "#ffd166" },
  { id: "skyshot", name: "Skyshot", emoji: "🎇", desc: "Three colourful sky bursts", count: 145, power: 1.2, color: "#7cffd2" }
];

const colors = ["#ffd166", "#ff4d9d", "#8a7dff", "#55e6ff", "#ff7b36", "#9cff6e", "#ffffff"];

export default function App() {
  const [sound, setSound] = useState(true);
  const [dark, setDark] = useState(true);
  const [auto, setAuto] = useState(true);
  const [selected, setSelected] = useState("rocket");
  const [fireworksMode, setFireworksMode] = useState(false);
  const [customColor, setCustomColor] = useState(colors[0]);
  const [diyas, setDiyas] = useState([true, false, true, false, true]);
  const [burstId, setBurstId] = useState(0);
  const [wish, setWish] = useState(
    "Lights will fade, crackers will stop… but may your happiness shine forever! May this Diwali fill your life with love, success and prosperity. 🪔"
  );
  const [toast, setToast] = useState("");

  const activeCracker = useMemo(
    () => crackers.find(item => item.id === selected) || crackers[0],
    [selected]
  );

  const showToast = message => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2200);
  };

  const launch = (cracker = activeCracker, color = customColor, sourceElement, atFrontPage = false, onNightStage = false) => {
    const sourceBounds = sourceElement?.getBoundingClientRect();
    const sceneBounds = atFrontPage
      ? onNightStage
        ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
        : document.querySelector(".diwali-scene")?.getBoundingClientRect()
      : undefined;
    const heightInScene = {
      rocket: 0.32,
      anar: 0.8,
      chakri: 0.82,
      ladi: 0.5,
      bomb: 0.34,
      phuljhadi: 0.8,
      skyshot: 0.32
    }[cracker.id] ?? 0.4;
    const sceneY = sceneBounds ? sceneBounds.top + sceneBounds.height * heightInScene : undefined;
    const launchY = sceneBounds
      ? ["anar", "chakri", "phuljhadi"].includes(cracker.id)
        ? Math.min(window.innerHeight - 80, Math.max(window.innerHeight * 0.72, sceneY))
        : Math.min(window.innerHeight * 0.58, Math.max(110, sceneY))
      : sourceBounds ? Math.max(100, sourceBounds.top - 145) : undefined;

    window.dispatchEvent(new CustomEvent("diwali:firework", {
      detail: {
        type: cracker.id,
        color,
        count: cracker.count,
        power: cracker.power,
        double: cracker.double,
        x: sceneBounds
          ? sceneBounds.left + sceneBounds.width * (0.32 + Math.random() * 0.36)
          : sourceBounds ? sourceBounds.left + sourceBounds.width / 2 : undefined,
        y: launchY
      }
    }));
    setBurstId(id => id + 1);
    playFireworkSound(cracker.id, sound);
  };

  const launchOnFrontPage = (cracker, color = cracker.color || customColor) => {
    setSelected(cracker.id);
    if (!fireworksMode) {
      setFireworksMode(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => launch(cracker, color, undefined, true, true), 650);
      return;
    }
    launch(cracker, color, undefined, true, true);
  };

  const leaveFireworksMode = () => {
    setFireworksMode(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const launchAllFirecrackers = () => {
    crackers.forEach((cracker, index) => {
      window.setTimeout(() => launch(cracker, cracker.color || customColor, undefined, true, true), index * 480);
    });
  };

  const copyWish = async () => {
    try {
      await navigator.clipboard.writeText(wish);
      showToast("Your Diwali wish has been copied!");
    } catch {
      showToast("Clipboard access is unavailable in this browser.");
    }
  };

  const shareWish = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Happy Diwali!", text: wish });
      } catch {
        // Sharing was cancelled by the user.
      }
    } else {
      copyWish();
    }
  };

  const toggleAllDiyas = () => {
    const shouldLight = !diyas.every(Boolean);
    setDiyas(diyas.map(() => shouldLight));
  };

  return (
    <main className={`app ${dark ? "theme-dark" : "theme-warm"} ${fireworksMode ? "fireworks-active" : ""}`}>
      <FireworksCanvas auto={auto} />

      <header className="navbar">
        <a className="brand" href="#home"><span>🪔</span> Diwali Celebration</a>
        <nav>
          <a className="active" href="#home">⌂ <span>Home</span></a>
          <a href="#firecrackers">✺ <span>Firecrackers</span></a>
          <a href="#diyas">🪔 <span>Diya</span></a>
          <a href="#photo">📸 <span>Photo</span></a>
          <a href="#custom">✿ <span>Decorate</span></a>
          <a href="#wishes">🎁 <span>Wishes</span></a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setSound(value => !value)} aria-label="Toggle sound">
            {sound ? <Volume2 /> : <VolumeX />}
          </button>
          <button className="icon-btn" onClick={() => setDark(value => !value)} aria-label="Toggle theme">
            {dark ? <Moon /> : <Sun />}
          </button>
        </div>
      </header>

      <DiwaliScene
        wish={wish}
        burstId={burstId}
        onLight={() => {
          setDiyas(diyas.map(() => true));
          launch(crackers[5], "#ffd166", undefined, true);
        }}
        onRangoli={() => launch(crackers[1], "#ff58c7", undefined, true)}
      />

      <DiwaliPhotoMaker />

      <section className="cracker-section section-shell" id="firecrackers">
        <div className="section-heading">
          <span>CHOOSE YOUR CELEBRATION</span>
          <small>Tap a firecracker to launch its magic</small>
        </div>
        <div className="cracker-grid">
          {crackers.map(cracker => (
            <button
              key={cracker.id}
              className={`cracker-card ${selected === cracker.id ? "selected" : ""}`}
              onClick={() => launchOnFrontPage(cracker)}
            >
              <span className="cracker-emoji">{cracker.emoji}</span>
              <strong>{cracker.name}</strong>
              <small>{cracker.desc}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="lower-grid">
        <article className="glass-panel" id="diyas">
          <div className="panel-title">
            <span>🪔</span>
            <div><h2>Light up your home</h2><p>Tap each diya to toggle its flame</p></div>
          </div>
          <div className="diya-row">
            {diyas.map((isLit, index) => (
              <Diya
                key={index}
                lit={isLit}
                onClick={() => setDiyas(old => old.map((value, i) => i === index ? !value : value))}
              />
            ))}
          </div>
          <button className="subtle-btn" onClick={toggleAllDiyas}>
            <Flame size={16} /> {diyas.every(Boolean) ? "Extinguish all" : "Light all diyas"}
          </button>
        </article>

        <article className="glass-panel" id="custom">
          <div className="panel-title">
            <span>✨</span>
            <div><h2>Create your fireworks</h2><p>Choose a colour and launch a custom burst</p></div>
          </div>
          <div className="color-row">
            {colors.map(color => (
              <button
                key={color}
                className={`color-dot ${customColor === color ? "chosen" : ""}`}
                style={{ "--swatch": color }}
                onClick={() => setCustomColor(color)}
                aria-label={`Choose ${color}`}
              />
            ))}
          </div>
          <div className="custom-bottom">
            <label>
              Pattern
              <select value={selected} onChange={event => setSelected(event.target.value)}>
                {crackers.map(cracker => <option key={cracker.id} value={cracker.id}>{cracker.name}</option>)}
              </select>
            </label>
            <button className="primary-btn compact" onClick={() => launchOnFrontPage(activeCracker, customColor)}>
              <WandSparkles size={17} /> Launch
            </button>
          </div>
          <label className="auto-toggle">
            <input type="checkbox" checked={auto} onChange={event => setAuto(event.target.checked)} />
            Ambient fireworks in background
          </label>
        </article>

        <article className="glass-panel" id="wishes">
          <div className="panel-title">
            <span>🎁</span>
            <div><h2>Send Diwali wishes</h2><p>A little light goes a long way</p></div>
          </div>
          <textarea value={wish} onChange={event => setWish(event.target.value)} aria-label="Your Diwali greeting" />
          <div className="wish-actions">
            <button className="subtle-btn" onClick={copyWish}><Copy size={16} /> Copy</button>
            <button className="subtle-btn" onClick={shareWish}><Share2 size={16} /> Share</button>
          </div>
        </article>
      </section>

      <footer>
        <span>✦ May your days shine bright and your year sparkle with happiness. ✦</span>
        <small>Developed by Lavkush Prasad</small>
      </footer>
      <button className="random-btn" onClick={() => launchOnFrontPage(crackers[Math.floor(Math.random() * crackers.length)])}>
        <RotateCcw size={17} /> Surprise burst
      </button>
      {fireworksMode && (
        <section className="fireworks-stage-controls" aria-label="Diwali night fireworks">
          <div className="fireworks-stage-heading">
            <div>
              <span className="fireworks-stage-eyebrow">A FESTIVAL OF LIGHT</span>
              <h1>Diwali Night</h1>
            </div>
            <button type="button" className="fireworks-back-btn" onClick={leaveFireworksMode}>
              <RotateCcw size={15} /> Back to celebration
            </button>
          </div>
          <div className="fireworks-tray">
            <div className="fireworks-tray-heading">
              <span>Choose a firework</span>
              <button type="button" onClick={launchAllFirecrackers}>Light them all</button>
            </div>
            <div className="fireworks-tray-list">
              {crackers.map(cracker => (
                <article
                  key={cracker.id}
                  className={`fireworks-tray-card ${selected === cracker.id ? "selected" : ""}`}
                  style={{ "--cracker-color": cracker.color }}
                >
                  <span className="fireworks-tray-emoji" aria-hidden="true">{cracker.emoji}</span>
                  <strong>{cracker.name}</strong>
                  <button type="button" onClick={() => launchOnFrontPage(cracker)} aria-label={`Light up ${cracker.name}`}>
                    Light up
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      {toast && <div className="toast"><Sparkles size={17} /> {toast}</div>}
    </main>
  );
}