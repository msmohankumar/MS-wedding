// ============================================================
// WEDDING SETTINGS
// ============================================================
const weddingInstant = new Date("2026-11-18T00:00:00+05:30").getTime();

// ============================================================
// LIVE COUNTDOWN
// ============================================================
function updateCountdown() {
  const remaining = Math.max(0, weddingInstant - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000)
  };
  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value).padStart(2, "0");
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// CLASSIC ENVELOPE OPENING + OPTIONAL BACKGROUND MUSIC
// ============================================================
const envelope = document.getElementById("envelope");
const openInvitationButton = document.getElementById("openInvitation");
const tapHint = document.getElementById("tapHint");
const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
const musicNote = document.getElementById("musicNote");

let invitationOpened = false;

async function playWeddingMusic() {
  if (!music || !music.getAttribute("src")) return;
  try {
    await music.play();
    musicLabel.textContent = "Music on";
    musicNote.textContent = "A little music for your celebration.";
  } catch (error) {
    musicLabel.textContent = "Tap ♫ to play";
    musicNote.textContent = "Your browser blocked autoplay. Use the Music button to start.";
  }
}

openInvitationButton?.addEventListener("click", async () => {
  if (invitationOpened) return;
  invitationOpened = true;
  envelope?.classList.add("open");
  openInvitationButton.setAttribute("aria-label", "Invitation opened");
  openInvitationButton.disabled = true;
  tapHint.textContent = "With love, we invite you to celebrate with us.";
  sprinklePetals();
  await playWeddingMusic();
});

musicButton?.addEventListener("click", async () => {
  if (!music) return;
  if (music.paused) {
    await playWeddingMusic();
  } else {
    music.pause();
    musicLabel.textContent = "Music off";
    musicNote.textContent = "Music paused.";
  }
});

// ============================================================
// SCRATCH CARD: WORKS WITH MOUSE, TOUCH AND PEN
// ============================================================
const canvas = document.getElementById("scratchCanvas");
const card = document.getElementById("scratchCard");
const context = canvas?.getContext("2d", { willReadFrequently: true });
let isScratching = false;
let dateRevealed = false;

function paintScratchFoil() {
  if (!canvas || !context || dateRevealed || !card) return;
  const rect = card.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const gold = context.createLinearGradient(0, 0, rect.width, rect.height);
  gold.addColorStop(0, "#9f783d");
  gold.addColorStop(.25, "#e8ce8c");
  gold.addColorStop(.5, "#c29a55");
  gold.addColorStop(.75, "#f0dba5");
  gold.addColorStop(1, "#a77f43");
  context.fillStyle = gold;
  context.fillRect(0, 0, rect.width, rect.height);

  context.fillStyle = "rgba(255,250,235,.2)";
  for (let y = 8; y < rect.height; y += 13) {
    for (let x = (y % 2) * 7; x < rect.width; x += 14) {
      context.beginPath();
      context.arc(x, y, .7, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.fillStyle = "#fff3d2";
  context.textAlign = "center";
  context.font = "11px Georgia";
  context.fillText("A DATE TO REMEMBER", rect.width / 2, rect.height / 2 - 5);
  context.font = "25px Georgia";
  context.fillText("✧  SCRATCH HERE  ✧", rect.width / 2, rect.height / 2 + 30);
}

function scratchAt(event) {
  if (!isScratching || dateRevealed || !context || !canvas) return;
  const bounds = canvas.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  context.globalCompositeOperation = "destination-out";
  context.beginPath();
  context.arc(x, y, 23, 0, Math.PI * 2);
  context.fill();
  context.globalCompositeOperation = "source-over";
  checkScratchProgress();
}

function checkScratchProgress() {
  if (!context || !canvas || dateRevealed) return;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparentSamples = 0;
  let samples = 0;
  for (let i = 3; i < pixels.length; i += 128) {
    samples++;
    if (pixels[i] === 0) transparentSamples++;
  }
  if (samples && transparentSamples / samples > .48) revealScratchCard();
}

function revealScratchCard() {
  if (dateRevealed) return;
  dateRevealed = true;
  if (context && canvas) context.clearRect(0, 0, canvas.width, canvas.height);
  canvas?.classList.add("scratched");
  sprinklePetals();
}

canvas?.addEventListener("pointerdown", event => {
  if (dateRevealed) return;
  isScratching = true;
  canvas.setPointerCapture?.(event.pointerId);
  scratchAt(event);
});
canvas?.addEventListener("pointermove", scratchAt);
["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {
  canvas?.addEventListener(type, () => { isScratching = false; });
});
document.getElementById("revealDate")?.addEventListener("click", revealScratchCard);
window.addEventListener("resize", () => {
  if (!dateRevealed) paintScratchFoil();
});
paintScratchFoil();

// ============================================================
// DECORATIVE PETALS
// ============================================================
function sprinklePetals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.querySelector(".petal-layer");
  if (!layer) return;

  for (let i = 0; i < 12; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = Math.random() > .5 ? "✿" : "❀";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
    petal.style.animationDuration = `${4 + Math.random() * 4}s`;
    petal.style.fontSize = `${12 + Math.random() * 12}px`;
    layer.appendChild(petal);
    window.setTimeout(() => petal.remove(), 8500);
  }
}
