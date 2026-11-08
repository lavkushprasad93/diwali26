const soundEffects = {
  rocket: { file: "firecracker-106974.mp3", duration: 1.1 },
  anar: { file: "firework-buzz.mp3", duration: 1.6 },
  chakri: { file: "firework-buzz.mp3", duration: 1.6 },
  ladi: { file: "firecrackers-chain.mp3", duration: 3 },
  bomb: { file: "bang.mp3", duration: 1.6 },
  phuljhadi: { file: "phuljhadi-firecrackers.mp3", duration: 2 },
  skyshot: { file: "urban-fireworks.mp3", duration: 5 }
};

const audioPlayers = new Map();

export function playFireworkSound(type = "rocket", enabled = true) {
  if (!enabled) return;

  const effect = soundEffects[type] || soundEffects.rocket;
  let audio = audioPlayers.get(type);

  if (!audio) {
    audio = new Audio(`/sounds/${effect.file}`);
    audio.preload = "auto";
    audio.volume = 0.45;
    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= effect.duration) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    audioPlayers.set(type, audio);
  }

  audio.currentTime = 0;
  audio.play().catch(error => {
    console.error(`Unable to play the ${type} firecracker sound.`, error);
  });
}
