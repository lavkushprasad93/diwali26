import { useState } from "react";
import { Sparkles } from "lucide-react";

const rangoliPetals = Array.from({ length: 12 }, (_, index) => index);

export default function DiwaliScene({ wish, onLight, onRangoli, burstId }) {
  const [lit, setLit] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [rangoliColored, setRangoliColored] = useState(false);

  const lightDiya = () => {
    if (!lit) {
      setLit(true);
      onLight();
    }
    setWishOpen(open => !open);
  };

  return (
    <section className={`diwali-scene ${lit ? "scene-is-lit" : ""}`} id="home" aria-label="Interactive Diwali home">
      {burstId > 0 && <div key={burstId} className="scene-burst-flash" aria-hidden="true" />}
      <div className="scene-room" aria-hidden="true">
        <div className="scene-ceiling" />
        <div className="scene-back-wall">
          <div className="scene-door"><span>ॐ</span></div>
          <div className="scene-door-glow" />
        </div>
        <div className="scene-side-wall scene-side-wall-left" />
        <div className="scene-side-wall scene-side-wall-right" />
        <div className="scene-window scene-window-left"><i /><i /><i /><i /></div>
        <div className="scene-window scene-window-right"><i /><i /><i /><i /></div>
        <div className="scene-hanging scene-hanging-left">✺　✿　✺　✿　✺</div>
        <div className="scene-hanging scene-hanging-right">✺　✿　✺　✿　✺</div>
        <div className="scene-garland scene-garland-left"><span>✿</span><span>✿</span><span>✿</span><span>✿</span><span>✿</span></div>
        <div className="scene-garland scene-garland-right"><span>✿</span><span>✿</span><span>✿</span><span>✿</span><span>✿</span></div>
        <div className="scene-floor" />
        <div className={`scene-rangoli ${rangoliColored ? "rangoli-colored" : ""}`}>
          {rangoliPetals.map(index => <i key={index} style={{ "--petal": index }} />)}
          <span />
        </div>
      </div>

      <div className="scene-copy">
        <span className="scene-eyebrow">A LITTLE DIWALI MAGIC</span>
        <h1>Lights will fade, <em>happiness will shine.</em></h1>
        <p>A little Diwali wonderland, made just for you.</p>
      </div>

      <div className="scene-lantern scene-lantern-left" aria-hidden="true"><span /></div>
      <div className="scene-lantern scene-lantern-right" aria-hidden="true"><span /></div>
      <div className="scene-sparkle scene-sparkle-one" aria-hidden="true">✦</div>
      <div className="scene-sparkle scene-sparkle-two" aria-hidden="true">✧</div>

      <button
        className="scene-rangoli-control"
        type="button"
        onPointerDown={() => setRangoliColored(true)}
        onClick={() => {
          onRangoli();
          setRangoliColored(true);
        }}
        aria-label={rangoliColored ? "Rangoli colored" : "Press and hold to color the rangoli"}
      >
        <span className="scene-rangoli-hint">{rangoliColored ? "Beautifully done!" : "Press and hold to color"}</span>
      </button>

      <div className="scene-greeting" aria-live="polite">
        {wishOpen && (
          <div className="scene-wish-card">
            <Sparkles size={18} />
            <p>{wish}</p>
            <span>With love, this Diwali and always</span>
          </div>
        )}
      </div>

      <button
        className="scene-diya"
        type="button"
        onClick={lightDiya}
        aria-label={lit ? "Show or hide your Diwali wish" : "Light the diya and reveal your Diwali wish"}
        aria-expanded={wishOpen}
      >
        <span className="scene-flame" />
        <span className="scene-diya-bowl"><i /></span>
        <span className="scene-diya-glow" />
      </button>
      <div className="scene-instruction">
        <span>{lit ? "A little light goes a long way" : "Tap the diya to light up your home"}</span>
        <span className="scene-instruction-arrow" aria-hidden="true">↓</span>
      </div>
    </section>
  );
}
