// ---- Edit these to personalize ----
const BIRTHDAY_NAME = "Nana Yaa";
const BIRTH_YEAR = 1995;     // year Nana Yaa was born
const BIRTH_MONTH = 5;       // 1 = Jan, 5 = May
const BIRTH_DAY = 25;
// Spotify playlist embed (default = "Today's Top Hits"). Swap with your own.
const SPOTIFY_PLAYLIST_ID = "37i9dQZF1DXcBWIGoYBM5M";
// -----------------------------------

const BIRTH_DATE = new Date(BIRTH_YEAR, BIRTH_MONTH - 1, BIRTH_DAY);

// =============================
// CONFETTI (defined first so anything below can call it)
// =============================
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let running = false;
const CONFETTI_COLORS = ["#f4acb7", "#ffd6ba", "#e58c9a", "#e0a96d", "#fff8f0", "#ffb4a2", "#b6dfd5"];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function makeParticle(x, y, big = false, drift = 0) {
    return {
        x,
        y,
        vx: (Math.random() - 0.5) * (big ? 8 : 3) + drift,
        vy: (Math.random() * -1 - (big ? 6 : 2)),
        gravity: 0.18,
        size: 6 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 0,
        maxLife: 180 + Math.random() * 80,
        shape: Math.random() < 0.5 ? "rect" : "circle",
    };
}

function burstConfetti(originEl, drift = 0, count = 80) {
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 3;
    if (originEl && originEl.getBoundingClientRect) {
        const r = originEl.getBoundingClientRect();
        cx = r.left + r.width / 2;
        cy = r.top + r.height / 2;
    }
    for (let i = 0; i < count; i++) particles.push(makeParticle(cx, cy, true, drift));
    if (!running) loop();
}

function loop() {
    running = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => {
        p.life++;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.5);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        return p.life < p.maxLife && p.y < canvas.height + 40;
    });
    if (particles.length > 0) {
        requestAnimationFrame(loop);
    } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// =============================
// IS IT HER BIRTHDAY TODAY?
// (Append ?bday=1 to the URL to preview the special day-mode without waiting.)
// =============================
const IS_BIRTHDAY_TODAY = (() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("bday") === "1") return true;
    const now = new Date();
    return now.getMonth() === BIRTH_MONTH - 1 && now.getDate() === BIRTH_DAY;
})();

// The intro greeting plays on every visit — first impression every time.
setupIntro();

if (IS_BIRTHDAY_TODAY) {
    document.body.classList.add("is-bday");
    startContinuousConfetti();
}

function setupIntro() {
    const intro = document.getElementById("intro");
    if (!intro) return;
    intro.hidden = false;

    let closed = false;
    const close = () => {
        if (closed) return;
        closed = true;
        intro.classList.add("is-leaving");
        setTimeout(() => {
            intro.hidden = true;
            for (let i = 0; i < 200; i++) {
                particles.push(makeParticle(Math.random() * window.innerWidth, -20, false));
            }
            if (!running) loop();
            // On her actual birthday, follow up with the secret card
            if (IS_BIRTHDAY_TODAY) setTimeout(showSecretCard, 2800);
        }, 700);
    };

    intro.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
        if (!intro.hidden && (e.key === "Escape" || e.key === "Enter" || e.key === " ")) close();
    });
    // Auto-dismiss after 7s if she just watches
    setTimeout(close, 7000);
}

function showSecretCard() {
    const modal = document.getElementById("easter-modal");
    if (!modal) return;
    modal.hidden = false;
    burstConfetti(modal);
}

function startContinuousConfetti() {
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        for (let i = 0; i < 6; i++) {
            particles.push(makeParticle(x, -20, false));
        }
        if (!running) loop();
    }, 1200);
}

// =============================
// AGE + COUNTDOWN
// =============================
(function ageAndCountdown() {
    const now = new Date();
    const thisYear = now.getFullYear();
    let nextBday = new Date(thisYear, BIRTH_MONTH - 1, BIRTH_DAY);
    if (now > nextBday) nextBday = new Date(thisYear + 1, BIRTH_MONTH - 1, BIRTH_DAY);

    // Show the celebration age (the age she's turning / just turned).
    const age = thisYear - BIRTH_YEAR;
    const days = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));

    document.getElementById("age-value").textContent = age;
    const countdownEl = document.getElementById("countdown-value");
    const labelEl = document.getElementById("countdown-label");
    if (now.getMonth() === BIRTH_MONTH - 1 && now.getDate() === BIRTH_DAY) {
        countdownEl.textContent = "🎉";
        labelEl.textContent = "today's the day!";
    } else if (days === 1) {
        countdownEl.textContent = "1";
        labelEl.textContent = "day to go";
    } else {
        countdownEl.textContent = days;
        labelEl.textContent = "days to go";
    }
})();

// =============================
// YEAR IN NUMBERS
// =============================
(function yearInNumbers() {
    const now = new Date();
    const msAlive = now - BIRTH_DATE;
    const days = Math.floor(msAlive / (1000 * 60 * 60 * 24));
    const hours = Math.floor(msAlive / (1000 * 60 * 60));
    const moons = Math.floor(days / 29.53);

    document.getElementById("num-days").textContent = days.toLocaleString();
    document.getElementById("num-moons").textContent = moons.toLocaleString();
    document.getElementById("num-hours").textContent = hours.toLocaleString();

    const hbEl = document.getElementById("num-heartbeats");
    function updateHeartbeats() {
        const ms = Date.now() - BIRTH_DATE.getTime();
        const beats = Math.floor((ms / 1000 / 60) * 80);
        hbEl.textContent = beats.toLocaleString();
        hbEl.classList.remove("is-pulsing");
        // force reflow so the animation restarts
        void hbEl.offsetWidth;
        hbEl.classList.add("is-pulsing");
    }
    updateHeartbeats();
    setInterval(updateHeartbeats, 1500);
})();

// =============================
// GIFTS — tap-to-reveal
// =============================
document.querySelectorAll(".gift:not(.gift--surprise)").forEach((gift) => {
    const box = gift.querySelector(".gift__box");
    const gif = gift.dataset.gif;
    if (gif) box.style.setProperty("--gif-url", `url("${gif}")`);

    box.addEventListener("click", () => {
        const wasRevealed = box.classList.contains("is-revealed");
        const revealed = box.classList.toggle("is-revealed");
        if (revealed && !wasRevealed) burstConfetti(box);
    });
});

// Surprise gift — always tappable, special reveal
(function surpriseGift() {
    const gift = document.getElementById("surprise-gift");
    const box = gift?.querySelector(".gift__box");
    const hint = document.getElementById("surprise-hint");
    if (!gift || !box) return;
    box.addEventListener("click", () => {
        if (gift.classList.contains("is-opened")) return;
        gift.classList.add("is-opened");
        if (hint) hint.textContent = "Made just for you ♥";
        burstConfetti(box);
    });
})();

// =============================
// CAKE — blow out the candles
// =============================
(function setupCandles() {
    const container = document.getElementById("cake-candles");
    const counter = document.getElementById("candles-left");
    const wishEl = document.getElementById("cake-wish");
    const resetBtn = document.getElementById("cake-reset");
    if (!container) return;

    const now = new Date();
    const age = now.getFullYear() - BIRTH_YEAR;
    const TOTAL = Math.max(1, Math.min(40, age || 30));

    function build() {
        container.innerHTML = "";
        for (let i = 0; i < TOTAL; i++) {
            const c = document.createElement("button");
            c.className = "candle";
            c.type = "button";
            c.setAttribute("aria-label", `Candle ${i + 1}`);
            const flame = document.createElement("span");
            flame.className = "candle__flame";
            c.appendChild(flame);
            c.addEventListener("click", () => extinguish(c));
            container.appendChild(c);
        }
        counter.textContent = TOTAL;
        wishEl.hidden = true;
        resetBtn.hidden = true;
    }

    function extinguish(c) {
        if (c.classList.contains("is-out")) return;
        c.classList.add("is-out");
        const left = container.querySelectorAll(".candle:not(.is-out)").length;
        counter.textContent = left;
        if (left === 0) {
            wishEl.hidden = false;
            resetBtn.hidden = false;
            burstConfetti(container);
            setTimeout(() => burstConfetti(container, 0.3), 250);
            setTimeout(() => burstConfetti(container, -0.3), 500);
        }
    }

    resetBtn.addEventListener("click", build);
    build();
})();

// =============================
// VOICE MESSAGE (Web Speech API)
// =============================
(function voiceMessage() {
    const btn = document.getElementById("audio-btn");
    const label = document.getElementById("audio-btn-label");
    const icon = btn?.querySelector(".audio__icon");
    const fallback = document.getElementById("audio-fallback");
    if (!btn) return;

    const MESSAGE = `Happy birthday, ${BIRTHDAY_NAME}. The world is brighter because you're in it. Make today loud.`;

    if (!("speechSynthesis" in window)) {
        if (fallback) fallback.hidden = false;
        btn.disabled = true;
        return;
    }

    function pickVoice() {
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) return null;
        const prefer = ["Samantha", "Karen", "Moira", "Tessa", "Victoria", "Google UK English Female", "Microsoft Aria", "Microsoft Jenny"];
        for (const name of prefer) {
            const v = voices.find((x) => x.name.includes(name));
            if (v) return v;
        }
        return voices.find((v) => /en[-_]/i.test(v.lang)) || voices[0];
    }

    let isSpeaking = false;

    function speak() {
        const u = new SpeechSynthesisUtterance(MESSAGE);
        const v = pickVoice();
        if (v) u.voice = v;
        u.rate = 0.95;
        u.pitch = 1.05;
        u.volume = 1;
        u.onstart = () => {
            isSpeaking = true;
            label.textContent = "Stop";
            icon.textContent = "⏸";
        };
        u.onend = u.onerror = () => {
            isSpeaking = false;
            label.textContent = "Hear it again";
            icon.textContent = "▶";
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }

    // Warm up voice list early
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.addEventListener("voiceschanged", () => {
            window.speechSynthesis.getVoices();
        }, { once: true });
    }

    btn.addEventListener("click", () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            label.textContent = "Hear it again";
            icon.textContent = "▶";
            return;
        }
        if (!window.speechSynthesis.getVoices().length) {
            window.speechSynthesis.addEventListener("voiceschanged", speak, { once: true });
            setTimeout(() => { if (!isSpeaking) speak(); }, 250);
        } else {
            speak();
        }
    });
})();

// =============================
// WISH WALL (localStorage)
// =============================
(function wishWall() {
    const form = document.getElementById("wish-form");
    const wall = document.getElementById("wish-wall");
    const countEl = document.getElementById("wish-count");
    const nameInput = document.getElementById("wish-name");
    const msgInput = document.getElementById("wish-msg");
    if (!form) return;

    const KEY = "mhr.wishes.v1";
    const NOTE_COLORS = [
        ["#fff5b8", "#3a2230"],
        ["#ffd6dc", "#3a2230"],
        ["#c8e7ff", "#1f344d"],
        ["#d8f0c5", "#1d3320"],
        ["#ffd9b8", "#3a2230"],
        ["#e7d7ff", "#2d1f4d"],
    ];

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    }

    function save(wishes) {
        localStorage.setItem(KEY, JSON.stringify(wishes));
    }

    function render() {
        const wishes = load();
        wall.innerHTML = "";
        countEl.textContent = wishes.length;
        wishes.forEach((w, i) => {
            const note = document.createElement("div");
            note.className = "wish-note";
            const [bg, fg] = NOTE_COLORS[i % NOTE_COLORS.length];
            note.style.background = bg;
            note.style.color = fg;
            note.style.setProperty("--tilt", `${(Math.random() * 6 - 3).toFixed(2)}deg`);
            const msg = document.createElement("p");
            msg.className = "wish-note__msg";
            msg.textContent = w.msg;
            const from = document.createElement("p");
            from.className = "wish-note__from";
            from.textContent = `— ${w.name}`;
            note.appendChild(msg);
            note.appendChild(from);
            wall.appendChild(note);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const msg = msgInput.value.trim();
        if (!name || !msg) return;
        const wishes = load();
        wishes.unshift({ name, msg, ts: Date.now() });
        save(wishes);
        nameInput.value = "";
        msgInput.value = "";
        render();
        burstConfetti(form);
    });

    render();
})();

// =============================
// PLAYLIST TOGGLE
// =============================
(function playlist() {
    const btn = document.getElementById("player-btn");
    const embed = document.getElementById("player-embed");
    const label = document.getElementById("player-btn-label");
    if (!btn || !embed) return;
    let mounted = false;

    btn.addEventListener("click", () => {
        const pressed = btn.getAttribute("aria-pressed") === "true";
        if (pressed) {
            btn.setAttribute("aria-pressed", "false");
            embed.hidden = true;
            embed.innerHTML = "";
            mounted = false;
            label.textContent = "Play the birthday playlist";
        } else {
            btn.setAttribute("aria-pressed", "true");
            embed.hidden = false;
            if (!mounted) {
                const iframe = document.createElement("iframe");
                iframe.src = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;
                iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
                iframe.loading = "lazy";
                iframe.title = "Birthday playlist";
                embed.appendChild(iframe);
                mounted = true;
            }
            label.textContent = "Hide the playlist";
        }
    });
})();

// =============================
// EASTER EGG — click eyebrow 5 times
// =============================
(function easterEgg() {
    const trigger = document.getElementById("eyebrow");
    const modal = document.getElementById("easter-modal");
    const closeBtn = document.getElementById("easter-close");
    if (!trigger || !modal) return;

    let clicks = 0;
    let resetT;
    trigger.addEventListener("click", () => {
        clicks++;
        clearTimeout(resetT);
        resetT = setTimeout(() => { clicks = 0; }, 2500);
        if (clicks >= 5) {
            clicks = 0;
            modal.hidden = false;
            burstConfetti(modal);
        }
    });

    function close() { modal.hidden = true; }
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.hidden) close();
    });
})();

// =============================
// FLOATING BALLOONS
// =============================
(function balloons() {
    const layer = document.getElementById("balloons");
    if (!layer) return;
    const BALLOON_COLORS = ["#f4acb7", "#ffd6ba", "#e58c9a", "#e0a96d", "#b6dfd5", "#c6dbf0", "#ffb4a2"];
    const MAX = 6;

    function spawn() {
        if (layer.querySelectorAll(".balloon").length >= MAX) return;
        const b = document.createElement("div");
        b.className = "balloon";
        const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        b.style.background = `radial-gradient(circle at 30% 30%, ${color}cc, ${color})`;
        const left = Math.random() * 100;
        b.style.left = left + "%";
        const dur = 14 + Math.random() * 10;
        b.style.animationDuration = dur + "s";
        const scale = 0.7 + Math.random() * 0.6;
        b.style.transform = `scale(${scale})`;
        b.addEventListener("click", () => {
            b.classList.add("is-popped");
            setTimeout(() => b.remove(), 400);
            burstConfetti(b, 0, 30);
        });
        b.addEventListener("animationend", () => b.remove());
        layer.appendChild(b);
    }

    setTimeout(spawn, 800);
    setTimeout(spawn, 2200);
    setInterval(spawn, 4500);
})();

// =============================
// SHARE
// =============================
(function share() {
    const shareBtn = document.getElementById("share-btn");
    const shareToast = document.getElementById("share-toast");
    if (!shareBtn) return;

    function showToast(msg) {
        shareToast.textContent = msg;
        shareToast.classList.add("is-visible");
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => shareToast.classList.remove("is-visible"), 3000);
    }

    shareBtn.addEventListener("click", async () => {
        const shareData = {
            title: `Happy Birthday, ${BIRTHDAY_NAME}!`,
            text: `A little birthday surprise for ${BIRTHDAY_NAME} 🎉`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showToast("Sent!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard ✨");
            }
        } catch (err) {
            if (err.name !== "AbortError") showToast("Couldn't share — try copying the URL");
        }
    });
})();

// =============================
// INITIAL CONFETTI BURST ON LOAD
// =============================
window.addEventListener("load", () => {
    setTimeout(() => {
        for (let i = 0; i < 120; i++) {
            particles.push(makeParticle(window.innerWidth / 2, -20, false));
        }
        for (let i = 0; i < 40; i++) particles.push(makeParticle(0, window.innerHeight / 2, true));
        for (let i = 0; i < 40; i++) particles.push(makeParticle(window.innerWidth, window.innerHeight / 2, true));
        if (!running) loop();
    }, 250);
});
