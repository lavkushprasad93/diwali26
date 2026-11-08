import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Sparkles } from "lucide-react";

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;
const TEMPLATE_SHUFFLE_DELAY = 180;
const templates = [
  {
    id: "golden-glow",
    label: "Golden Glow",
    background: ["#32162f", "#54223b", "#171126"],
    frame: "#ffdc93",
    header: "A FESTIVAL OF LIGHT",
    greeting: "Happy Diwali",
    message: "May your happiness shine all year long ✨",
    photoHeight: 930,
    nameSize: 78,
    greetingSize: 75
  },
  {
    id: "rangoli-royal",
    label: "Rangoli Royal",
    background: ["#102b38", "#382254", "#15112c"],
    frame: "#91e4ce",
    header: "LIGHT • LOVE • PROSPERITY",
    greeting: "Shubh Deepawali",
    message: "May every moment glow with joy ✨",
    photoHeight: 875,
    nameSize: 82,
    greetingSize: 70
  },
  {
    id: "marigold-night",
    label: "Marigold Night",
    background: ["#4a1f25", "#7d362c", "#21132a"],
    frame: "#ffba62",
    header: "A BRIGHTER YEAR BEGINS",
    greeting: "Diwali Mubarak",
    message: "Wishing you warmth, wonder and light ✨",
    photoHeight: 900,
    nameSize: 76,
    greetingSize: 74
  }
];

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawFallbackPortrait(ctx) {
  const glow = ctx.createRadialGradient(540, 500, 35, 540, 500, 490);
  glow.addColorStop(0, "#f7b854");
  glow.addColorStop(0.35, "#aa4a57");
  glow.addColorStop(1, "#241532");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, 950);

  ctx.save();
  ctx.translate(CANVAS_WIDTH / 2, 460);
  for (let i = 0; i < 12; i++) {
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.ellipse(0, -205, 48, 132, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 222, 146, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 223, 152, 0.72)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 66, 0, Math.PI * 2);
  ctx.fillStyle = "#efaa49";
  ctx.shadowColor = "#ffd778";
  ctx.shadowBlur = 34;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#fff1bd";
  ctx.textAlign = "center";
  ctx.font = "700 110px 'Times New Roman', Times, serif";
  ctx.fillText("शुभ दीपावली", CANVAS_WIDTH / 2, 810);
}

function drawPhoto(ctx, image, photoHeight) {
  const scale = Math.max(CANVAS_WIDTH / image.width, photoHeight / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  ctx.save();
  roundedRect(ctx, 48, 48, CANVAS_WIDTH - 96, photoHeight, 34);
  ctx.clip();
  ctx.drawImage(image, (CANVAS_WIDTH - width) / 2, 48 + (photoHeight - height) / 2, width, height);
  const shade = ctx.createLinearGradient(0, photoHeight * 0.42, 0, photoHeight + 48);
  shade.addColorStop(0, "rgba(29, 13, 30, 0)");
  shade.addColorStop(0.7, "rgba(29, 13, 30, 0.55)");
  shade.addColorStop(1, "rgba(29, 13, 30, 0.96)");
  ctx.fillStyle = shade;
  ctx.fillRect(48, 48, CANVAS_WIDTH - 96, photoHeight);
  ctx.restore();
}

function drawDiya(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = "#ffb544";
  ctx.shadowBlur = 48;
  ctx.beginPath();
  ctx.ellipse(0, 0, 64, 21, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#ffc65e";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(-63, -2);
  ctx.quadraticCurveTo(0, 78, 63, -2);
  ctx.quadraticCurveTo(0, 29, -63, -2);
  ctx.fillStyle = "#bc4839";
  ctx.fill();
  ctx.strokeStyle = "#ffdf8d";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(-31, -59, 29, -75, 0, -132);
  ctx.bezierCurveTo(49, -84, 37, -40, 0, -18);
  ctx.fillStyle = "#fff0a5";
  ctx.fill();
  ctx.restore();
}

function drawGreetingCard(canvas, name, photo, template) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create the Diwali image.");

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const background = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  background.addColorStop(0, template.background[0]);
  background.addColorStop(0.55, template.background[1]);
  background.addColorStop(1, template.background[2]);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (photo) drawPhoto(ctx, photo, template.photoHeight);
  else drawFallbackPortrait(ctx);

  const footerStart = Math.max(740, template.photoHeight - 80);
  const fade = ctx.createLinearGradient(0, footerStart, 0, CANVAS_HEIGHT);
  fade.addColorStop(0, "rgba(32, 15, 34, 0.15)");
  fade.addColorStop(0.28, "rgba(32, 15, 34, 0.89)");
  fade.addColorStop(1, template.background[2]);
  ctx.fillStyle = fade;
  ctx.fillRect(0, footerStart, CANVAS_WIDTH, CANVAS_HEIGHT - footerStart);

  ctx.strokeStyle = template.frame;
  ctx.lineWidth = 5;
  roundedRect(ctx, 28, 28, CANVAS_WIDTH - 56, CANVAS_HEIGHT - 56, 38);
  ctx.stroke();
  ctx.strokeStyle = `${template.frame}77`;
  ctx.lineWidth = 2;
  roundedRect(ctx, 45, 45, CANVAS_WIDTH - 90, CANVAS_HEIGHT - 90, 29);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = template.frame;
  ctx.shadowColor = template.frame;
  ctx.shadowBlur = 20;
  ctx.font = "700 31px 'Times New Roman', Times, serif";
  ctx.letterSpacing = "7px";
  ctx.fillText(template.header, CANVAS_WIDTH / 2, 105);
  ctx.shadowBlur = 0;
  ctx.letterSpacing = "0px";

  const greetingY = 1080;
  drawDiya(ctx, CANVAS_WIDTH / 2, greetingY - 122);

  ctx.fillStyle = "#fff0c8";
  ctx.font = `italic 700 ${template.greetingSize}px 'Times New Roman', Times, serif`;
  ctx.fillText(template.greeting, CANVAS_WIDTH / 2, greetingY);

  const displayName = name.trim().slice(0, 60);
  ctx.fillStyle = template.frame;
  ctx.font = `700 ${template.nameSize}px 'Times New Roman', Times, serif`;
  ctx.fillText(displayName, CANVAS_WIDTH / 2, 1178, CANVAS_WIDTH - 105);

  ctx.fillStyle = "#f3dfc5";
  ctx.font = "32px 'Times New Roman', Times, serif";
  ctx.fillText(template.message, CANVAS_WIDTH / 2, 1242, CANVAS_WIDTH - 100);

  if (template.id === "rangoli-royal") {
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2, 710);
    ctx.strokeStyle = `${template.frame}99`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.ellipse(0, -72, 14, 43, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (template.id === "marigold-night") {
    ctx.fillStyle = template.frame;
    for (let i = 0; i < 7; i++) {
      const x = 170 + i * 123;
      ctx.beginPath();
      ctx.arc(x, 875 + Math.sin(i * 1.4) * 22, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 35; i++) {
    const x = 70 + ((i * 193) % (CANVAS_WIDTH - 140));
    const y = 130 + ((i * 127) % 700);
    ctx.beginPath();
    ctx.arc(x, y, i % 4 === 0 ? 5 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 225, 160, 0.8)" : "rgba(255, 171, 83, 0.7)";
    ctx.fill();
  }
}

export default function DiwaliPhotoMaker() {
  const canvasRef = useRef(null);
  const previewUrlRef = useRef("");
  const lastTemplateRef = useRef(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [templateLabel, setTemplateLabel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!photo) {
      setPhotoUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const handlePhotoChange = event => {
    const file = event.target.files?.[0];
    setError("");
    setResultUrl("");
    if (!file) {
      setPhoto(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhoto(null);
      setError("Choose an image file such as JPG, PNG, or WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhoto(null);
      setError("Choose an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }
    setPhoto(file);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your name to make your Diwali greeting.");
      return;
    }

    let image;
    let nextUrl = "";
    setIsGenerating(true);
    try {
      if (photo) image = await createImageBitmap(photo);

      const previousIndex = templates.findIndex(template => template.id === lastTemplateRef.current);
      const finalCandidates = templates.filter((_, index) => index !== previousIndex);
      const finalTemplate = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
      const shuffleCount = 2 + Math.floor(Math.random() * 2);
      let shuffleIndex = previousIndex;

      for (let cycle = 0; cycle < shuffleCount; cycle++) {
        const candidates = templates.filter((_, index) => index !== shuffleIndex);
        const previewTemplate = candidates[Math.floor(Math.random() * candidates.length)];
        shuffleIndex = templates.indexOf(previewTemplate);
        drawGreetingCard(canvasRef.current, name, image, previewTemplate);
        setTemplateLabel(`Trying ${previewTemplate.label}...`);
        await new Promise(resolve => window.setTimeout(resolve, TEMPLATE_SHUFFLE_DELAY));
      }

      drawGreetingCard(canvasRef.current, name, image, finalTemplate);
      image?.close();
      const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Your browser could not create the greeting image.");
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = URL.createObjectURL(blob);
      nextUrl = previewUrlRef.current;
      lastTemplateRef.current = finalTemplate.id;
      setTemplateLabel(finalTemplate.label);
      setResultUrl(nextUrl);
    } catch (generationError) {
      image?.close();
      setError(generationError.message || "The image could not be created. Try a different photo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const safeFileName = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "friend";

  return (
    <section className="photo-maker section-shell" id="photo">
      <div className="photo-maker-copy">
        <span className="photo-maker-kicker">A GREETING MADE JUST FOR YOU</span>
        <h2>Make your Diwali portrait</h2>
        <p>Add your name and, if you like, a selfie. We’ll decorate it with a festive Diwali frame, diya, and greeting.</p>
        <span className="photo-privacy"><span aria-hidden="true">🔒</span> Your photo stays on this device. Nothing is uploaded.</span>
      </div>

      <form className="photo-maker-form" onSubmit={handleSubmit}>
        <label className="photo-field">
          <span>Your name <b aria-hidden="true">*</b></span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={event => {
              setName(event.target.value);
              setResultUrl("");
            }}
            placeholder="Enter your name"
            autoComplete="name"
            maxLength={60}
            required
          />
        </label>

        <label className="photo-field">
          <span>Photo <small>(optional)</small></span>
          <span className="photo-input-wrap">
            <ImagePlus size={18} />
            <span>{photo ? photo.name : "Choose a photo or take a selfie"}</span>
            <input type="file" accept="image/*" capture="user" onChange={handlePhotoChange} />
          </span>
          <small className="photo-help">JPG, PNG, or WebP · up to 10 MB</small>
        </label>

        {error && <p className="photo-error" role="alert">{error}</p>}

        <button className="primary-btn photo-submit" type="submit" disabled={isGenerating}>
          <Sparkles size={18} /> {isGenerating ? "Finding your festive style..." : "Create my Diwali image"}
        </button>
      </form>

      {resultUrl && (
        <div className="photo-result" aria-live="polite">
          <span className="photo-template-label">{templateLabel}</span>
          <img src={resultUrl} alt={`Personalized Happy Diwali greeting for ${name}`} />
          <a className="subtle-btn photo-download" href={resultUrl} download={`happy-diwali-${safeFileName}.png`}>
            <Download size={17} /> Download image
          </a>
        </div>
      )}

      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="photo-maker-canvas" aria-hidden="true" />
    </section>
  );
}
