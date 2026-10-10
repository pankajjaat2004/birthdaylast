const PASSWORD = "1010";
const PASSWORD_HINT = "Think of the day our story began.";

const LOVE_LETTER = [
  "happy birthday my love ❤️",
  "Honestly i dont even know where to start but first i just want to say you are the most beautiful, sweet , and caring girl i have ever met. you came in my life when i wasnt even looking for a relationship and somehow you became someone i never want to lose. You make my days easy you are not just my partner you are my comfort and ofc my favourite person i love you sooo muchhhh. Its been a year when we met on your birthday last year ahh time flies so fast but tumhare last birthday se abtk my life has been so much better than it was before little arguments , silly things , sometimes serious arguments but in the end i hope we both remember why we chose each other i want us to keep growing together i will always be by your side. happy birthday again my baby and i love you more than these words could ever explain.",
];

const MEMORIES = [
  { src: "photos/memory1.jpeg", title: "Our First Meet", text: "And look how awkward i was bro lol." },
  { src: "photos/memory2.jpeg", title: "My  Birthday", text: "This was the best day and you are the reason." },
  { src: "photos/memory3.jpeg", title: "Same day", text: "A kiss when we were posing and i was focusing on kissing you eheheh." },
  { src: "photos/memory4.jpeg", title: "MKT", text: "Reliving the day we first met it was so special." },
  { src: "photos/memory5.jpeg", title: "Our Fav Spot", text: "This is one of my best day and i remember every moment" },
  { src: "photos/memory6.jpeg", title: "Your Birthday", text: "Look at how happy i am with you ." },
  { src: "photos/memory7.jpeg", title: "Same day", text: "This is my fav photo of ours look at how cute we look." },
  { src: "photos/memory8.jpeg", title: "MKT", text: "Your make my days better and this day was one of them." },
  { src: "photos/memory9.jpeg", title: "Your bday again", text: "I cant stop looking at this photo and saying in my mind damn shes my gf." },
  { src: "photos/memory10.jpeg", title: "Last selfie", text: "This is  the most fun ive ever had ina while altho i was chup it was very fun :smileinpain:." },
];

const SLIDE_MS = 4500;

const music = new Audio("audio/dande.mp3");
music.loop = true;
music.volume = 0.5;

const voiceNote = new Audio("audio/voiceNote.mp3");
voiceNote.preload = "auto";

const screens = {};
document.querySelectorAll(".screen").forEach((el) => {
  screens[el.dataset.screen] = el;
});

function show(name) {
  Object.entries(screens).forEach(([key, el]) => el.classList.toggle("active", key === name));
  if (name === "bokeh") setTimeout(() => show("password"), 5000);
  if (name === "voice") startVoice();
}

function $(id) {
  return document.getElementById(id);
}

function hideOnError(img) {
  img.addEventListener("error", () => {
    img.style.display = "none";
  });
}

const DECOR = [
  { symbol: "♥", kind: "heart" },
  { symbol: "♥", kind: "heart" },
  { symbol: "✦", kind: "sparkle" },
  { symbol: "❀", kind: "petal" },
];

function scatterHearts() {
  document.querySelectorAll("[data-hearts]").forEach((box) => {
    for (let i = 0; i < 22; i += 1) {
      const decor = DECOR[i % DECOR.length];
      const heart = document.createElement("span");
      heart.className = `heart ${decor.kind}`;
      heart.textContent = decor.symbol;
      heart.style.left = `${(i * 37) % 100}%`;
      heart.style.top = `${(i * 53) % 100}%`;
      heart.style.fontSize = `${12 + (i % 4) * 6}px`;
      heart.style.animationDelay = `${(i % 5) * 0.6}s`;
      box.appendChild(heart);
    }
  });
}

// Gift and cake
function openGift() {
  const gift = screens.gift;
  if (gift.dataset.stage !== "gift") return;
  gift.dataset.stage = "opening";
  setTimeout(() => show("cake"), 900);
}

function burstParticles(x, y) {
  const symbols = ["♥", "✦", "❀", "★"];
  const count = 28;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = symbols[i % symbols.length];
    const angle = (Math.PI * 2 * i) / count;
    const distance = 90 + Math.random() * 120;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.addEventListener("animationend", () => particle.remove());
    document.body.appendChild(particle);
  }
}

function blow() {
  const cake = screens.cake;
  const rect = $("blow").getBoundingClientRect();
  burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  cake.classList.add("blown");
  $("cake-title").textContent = "Happy Birthday, Muskan!";
  $("cake-text").textContent = "Your wish is on its way...";
  $("blow").hidden = true;
  $("poppers").hidden = false;
  setTimeout(() => show("bokeh"), 3500);
}

// Password
let digits = "";
let locked = false;
let wrong = false;
let showHint = false;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

function renderPassword() {
  const dots = $("dots");
  dots.innerHTML = "";
  for (let i = 0; i < 4; i += 1) {
    const dot = document.createElement("span");
    if (i < digits.length) dot.classList.add("filled");
    dots.appendChild(dot);
  }

  const status = $("status");
  status.className = "status";
  if (wrong) {
    status.textContent = "That's not it, try again.";
    status.classList.add("wrong");
  } else if (locked) {
    status.textContent = "Opening...";
  } else if (showHint) {
    status.textContent = `Hint: ${PASSWORD_HINT}`;
  } else {
    status.textContent = "";
  }

  $("dots").classList.toggle("shake", wrong);
}

function buildKeypad() {
  const pad = $("keypad");
  KEYS.forEach((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key";
    if (key === "") {
      button.classList.add("empty");
      button.disabled = true;
    } else if (key === "back") {
      button.textContent = "⌫";
      button.setAttribute("aria-label", "Delete");
      button.addEventListener("click", () => press("back"));
    } else {
      button.textContent = key;
      button.setAttribute("aria-label", key);
      button.addEventListener("click", () => press(key));
    }
    pad.appendChild(button);
  });
}

function press(key) {
  if (locked || wrong) return;
  if (key === "back") {
    digits = digits.slice(0, -1);
    renderPassword();
    return;
  }
  if (digits.length >= 4) return;
  digits += key;
  renderPassword();
  if (digits.length === 4) check();
}

function check() {
  if (digits === PASSWORD) {
    locked = true;
    music.play().catch(() => {});
    $("pw-gift").classList.add("hide");
    $("surprise").hidden = false;
    renderPassword();
    setTimeout(() => show("letter"), 2000);
    return;
  }
  wrong = true;
  showHint = true;
  renderPassword();
  setTimeout(() => {
    digits = "";
    wrong = false;
    renderPassword();
  }, 900);
}

document.addEventListener("keydown", (event) => {
  if (!screens.password.classList.contains("active")) return;
  if (/^[0-9]$/.test(event.key)) press(event.key);
  else if (event.key === "Backspace") press("back");
});

// Letter
function openLetter() {
  $("letter-sealed").hidden = true;
  const card = $("letter-open");
  card.hidden = false;
  $("letter-text").innerHTML = "";
  LOVE_LETTER.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    $("letter-text").appendChild(p);
  });
}

// Memories
function buildMemories() {
  const grid = $("grid");
  MEMORIES.forEach((memory, i) => {
    const card = document.createElement("article");
    card.className = "card";

    const photo = document.createElement("div");
    photo.className = "photo";
    const img = document.createElement("img");
    img.src = memory.src;
    img.alt = memory.title;
    hideOnError(img);
    photo.appendChild(img);

    const body = document.createElement("div");
    body.className = "body";
    const label = document.createElement("p");
    label.className = "label";
    label.textContent = `Memory ${i + 1}`;
    const title = document.createElement("h2");
    title.textContent = memory.title;
    const text = document.createElement("p");
    text.textContent = memory.text;
    body.append(label, title, text);

    card.append(photo, body);
    grid.appendChild(card);
  });
}

function goToVoice() {
  const next = $("memories-next");
  next.disabled = true;
  music.pause();
  voiceNote.muted = true;
  voiceNote.play().catch(() => {});
  $("overlay").hidden = false;
  setTimeout(() => {
    $("overlay").hidden = true;
    next.disabled = false;
    show("voice");
  }, 3000);
}

// Voice
let voiceIndex = 0;
let slideTimer = null;

function renderVoice() {
  const memory = MEMORIES[voiceIndex];
  const img = $("voice-img");
  img.style.display = "";
  img.src = memory.src;
  img.alt = memory.title;
  $("voice-title").textContent = memory.title;
  $("voice-text").textContent = memory.text;

  const dots = $("voice-dots");
  dots.innerHTML = "";
  MEMORIES.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = i === voiceIndex ? "dot active" : "dot";
    dots.appendChild(dot);
  });
}

function playVoiceNote() {
  voiceNote.pause();
  voiceNote.currentTime = 0;
  voiceNote.muted = false;
  const gestures = ["pointerdown", "keydown", "touchstart"];
  const removeListeners = () => gestures.forEach((g) => window.removeEventListener(g, tryPlay));
  function tryPlay() {
    voiceNote.play().then(removeListeners).catch(() => {});
  }
  gestures.forEach((g) => window.addEventListener(g, tryPlay));
  tryPlay();
}

function startVoice() {
  music.pause();
  voiceIndex = 0;
  renderVoice();
  playVoiceNote();
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    voiceIndex = (voiceIndex + 1) % MEMORIES.length;
    renderVoice();
  }, SLIDE_MS);
}

// Wiring
document.getElementById("open-gift").addEventListener("click", openGift);
document.getElementById("open-gift-btn").addEventListener("click", openGift);
document.getElementById("blow").addEventListener("click", blow);
$("open-letter").addEventListener("click", openLetter);
$("memories-next").addEventListener("click", goToVoice);
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => show(btn.dataset.next));
});

scatterHearts();
buildKeypad();
renderPassword();
buildMemories();
show("gift");
