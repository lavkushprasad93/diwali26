export default function Diya({ lit, onClick }) {
  return (
    <button
      className={`diya ${lit ? "is-lit" : ""}`}
      onClick={onClick}
      aria-label={lit ? "Extinguish diya" : "Light diya"}
      title={lit ? "Extinguish diya" : "Light diya"}
    >
      {lit && <span className="flame" />}
      <span className="diya-bowl" />
      <span className="diya-glow" />
    </button>
  );
}