
const pages = document.querySelectorAll(".page");
const starsContainer = document.getElementById("stars");
const sparklesContainer = document.getElementById("sparkles");
const envelope = document.getElementById("envelope");
const letterNext = document.getElementById("letterNext");
const tapHint = document.getElementById("tapHint");
const musicBtn = document.getElementById("musicBtn");

let currentPage = 1;
let audioContext = null;
let musicPlaying = false;
let musicTimer = null;
let masterGain = null;
let melodyIndex = 0;

function createStars() {
  for (let i = 0; i < 90; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 4 + "s";
    star.style.animationDuration = (2 + Math.random() * 4) + "s";
    starsContainer.appendChild(star);
  }
}

function nextPage(number) {
  pages.forEach(page => page.classList.remove("active"));

  const target = document.getElementById("page" + number);
  if (!target) return;

  target.classList.add("active");
  currentPage = number;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (number === 6) {
    launchFireworks();
    showToast("The whole kingdom celebrates you, Bubu! 💜");
  }
}

function openLetter() {
  if (envelope.classList.contains("open")) return;

  envelope.classList.add("open");
  tapHint.textContent = "A little message, straight from the heart 💜";

  setTimeout(() => {
    letterNext.classList.remove("hidden");
  }, 900);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2500);
}

/* Original magical instrumental using Web Audio API */
function startMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    showToast("Your browser does not support background music.");
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.12;
    masterGain.connect(audioContext.destination);
  }

  audioContext.resume();

  if (musicPlaying) return;

  musicPlaying = true;
  musicBtn.classList.add("playing");
  musicBtn.textContent = "♫";

  const notes = [
    [261.63, 329.63, 392.00],
    [293.66, 349.23, 440.00],
    [220.00, 261.63, 329.63],
    [246.94, 293.66, 369.99]
  ];

  function playNote(frequency, start, duration, volume, type) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type || "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function playMelody() {
    if (!musicPlaying) return;

    const now = audioContext.currentTime;
    const chord = notes[melodyIndex % notes.length];

    chord.forEach((frequency, index) => {
      playNote(frequency, now + index * 0.08, 2.8, 0.035, "sine");
    });

    const melody = [523.25, 587.33, 659.25, 587.33, 493.88, 440.00, 523.25, 392.00];
    playNote(melody[melodyIndex % melody.length], now, 1.8, 0.055, "triangle");

    melodyIndex++;
    musicTimer = setTimeout(playMelody, 1800);
  }

  playMelody();
}

function stopMusic() {
  musicPlaying = false;
  clearTimeout(musicTimer);
  musicBtn.classList.remove("playing");
  musicBtn.textContent = "♫";

  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.15);
  }
}

musicBtn.addEventListener("click", () => {
  if (musicPlaying) {
    stopMusic();
  } else {
    if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(0.12, audioContext.currentTime, 0.15);
    }
    startMusic();
  }
});

/* Fireworks and floating hearts */
function launchFireworks() {
  const colors = ["#f8d98b", "#e9a9d2", "#ffffff", "#c7a2ff", "#ffcf9f"];

  for (let i = 0; i < 65; i++) {
    setTimeout(() => {
      const burst = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];

      burst.style.position = "fixed";
      burst.style.left = Math.random() * 100 + "vw";
      burst.style.top = (15 + Math.random() * 65) + "vh";
      burst.style.width = "5px";
      burst.style.height = "5px";
      burst.style.borderRadius = "50%";
      burst.style.background = color;
      burst.style.boxShadow = `0 0 12px 4px ${color}`;
      burst.style.zIndex = "30";
      burst.style.pointerEvents = "none";

      document.body.appendChild(burst);

      burst.animate([
        { transform: "scale(0)", opacity: 1 },
        { transform: "scale(5)", opacity: 0 }
      ], {
        duration: 900 + Math.random() * 700,
        easing: "ease-out"
      });

      setTimeout(() => burst.remove(), 1800);
    }, i * 65);
  }

  for (let i = 0; i < 18; i++) {
    setTimeout(createFloatingHeart, i * 180);
  }
}

function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = ["💜", "💖", "✨", "♡", "🌸"][Math.floor(Math.random() * 5)];
  heart.style.left = Math.random() * 95 + "vw";
  heart.style.top = (65 + Math.random() * 25) + "vh";
  heart.style.fontSize = (16 + Math.random() * 20) + "px";

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 3200);
}

function celebrateAgain() {
  launchFireworks();
  showToast("A thousand wishes for your happiness! ✨");
}

function createAmbientSparkles() {
  setInterval(() => {
    const sparkle = document.createElement("div");
    sparkle.className = "floating-heart";
    sparkle.textContent = "✦";
    sparkle.style.color = "#f5d991";
    sparkle.style.left = Math.random() * 100 + "vw";
    sparkle.style.top = "95vh";
    sparkle.style.fontSize = "12px";

    sparklesContainer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3000);
  }, 700);
}

createStars();
createAmbientSparkles();

/* Music begins only after the visitor taps the music button. */
// Try autoplay when the website opens
window.addEventListener("load", () => {
  startMusic();
});

// If autoplay is blocked, start music on the first interaction
function enableFirstInteractionMusic() {
  if (!musicPlaying) {
    startMusic();
  }

  document.removeEventListener("click", enableFirstInteractionMusic);
  document.removeEventListener("touchstart", enableFirstInteractionMusic);
}

document.addEventListener("click", enableFirstInteractionMusic);
document.addEventListener("touchstart", enableFirstInteractionMusic);