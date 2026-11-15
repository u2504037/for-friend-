const $ = (id) => document.getElementById(id);

function makeConfetti(count = 100) {
  const colors = ["#f1d49a", "#d9c5ff", "#f3a9c9", "#ffffff", "#a9b8ff"];
  for (let i = 0; i < count; i++) {
    const bit = document.createElement("i");
    bit.className = "confetti";
    bit.style.left = Math.random() * 100 + "vw";
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.animationDuration = (3 + Math.random() * 3) + "s";
    bit.style.animationDelay = (Math.random() * 1.2) + "s";
    bit.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 7500);
  }
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

$("revealButton").addEventListener("click", () => {
  $("message").scrollIntoView({ behavior: "smooth" });
  makeConfetti(65);
  showToast("A little happiness, just for you ✨");
});

$("blowButton").addEventListener("click", () => {
  const candles = document.querySelector(".candles");
  if (candles.classList.contains("blown")) {
    showToast("Your wish is already on its way! ✨");
    return;
  }
  candles.classList.add("blown");
  $("wishResult").textContent = "May your wish find its way to you. ✨";
  $("blowButton").textContent = "Candles blown ✦";
  makeConfetti(90);
});

$("celebrateButton").addEventListener("click", () => {
  makeConfetti(120);
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Happy Birthday, Nishat! 🎉");
});

// Gentle original chime made with Web Audio; starts only after the visitor taps.
let audioContext = null;
let musicTimer = null;
let noteIndex = 0;
const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];

function playNote() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "sine";
  osc.frequency.value = notes[noteIndex % notes.length];
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.5);
  noteIndex++;
}

$("soundToggle").addEventListener("click", async () => {
  const button = $("soundToggle");
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") await audioContext.resume();
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
    $("soundIcon").textContent = "♫";
    $("soundLabel").textContent = "Sound off";
    button.setAttribute("aria-pressed", "false");
  } else {
    playNote();
    musicTimer = setInterval(playNote, 560);
    $("soundIcon").textContent = "♪";
    $("soundLabel").textContent = "Sound on";
    button.setAttribute("aria-pressed", "true");
  }
});

// Soft star field.
const canvas = $("stars");
const ctx = canvas.getContext("2d");
let stars = [];
function resizeStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: Math.min(95, Math.floor(innerWidth / 5)) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 1.25 + .25, a: Math.random() * .6 + .15,
    phase: Math.random() * Math.PI * 2
  }));
}
function drawStars(time = 0) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) {
    const alpha = s.a * (.65 + .35 * Math.sin(time / 900 + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(235,225,255,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", resizeStars);
resizeStars();
requestAnimationFrame(drawStars);

// Reveal sections as they enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(section => observer.observe(section));
