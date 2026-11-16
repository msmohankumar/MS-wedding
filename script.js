document.addEventListener("DOMContentLoaded", function () {
  const intro = document.getElementById("intro");
  const invitation = document.getElementById("invitation");
  const envelope = document.getElementById("envelope");
  const openSeal = document.getElementById("openSeal");
  const skipIntro = document.getElementById("skipIntro");
  const tapHint = document.getElementById("tapHint");

  let opened = false;

  // ---------------------------------------
  // FLOWER PETALS
  // ---------------------------------------

  function releasePetals() {
    const flowers = ["✿", "❀", "❁", "✾", "❃"];

    for (let i = 0; i < 35; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.fontSize = (12 + Math.random() * 18) + "px";
      petal.style.animationDuration = (4 + Math.random() * 5) + "s";
      petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");

      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 10000);
    }
  }

  // ---------------------------------------
  // OPEN ENVELOPE
  // ---------------------------------------

  function openInvitation() {
    if (opened) return;
    opened = true;

    envelope.classList.add("open");
    tapHint.textContent = "Your invitation is opening...";

    releasePetals();

    setTimeout(function () {
      intro.classList.add("closed");
      invitation.classList.add("visible");
      invitation.setAttribute("aria-hidden", "false");

      window.scrollTo({ top: 0, behavior: "smooth" });

      startCountdown();
      setupScratchCard();
    }, 1600);
  }

  openSeal.addEventListener("click", openInvitation);
  skipIntro.addEventListener("click", openInvitation);

  // ---------------------------------------
  // COUNTDOWN
  // Wedding: 12 November 2026, 6:30 PM IST
  // ---------------------------------------

  function startCountdown() {
    const targetDate = new Date("2026-11-12T18:30:00+05:30").getTime();

    const days = document.getElementById("days");
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");

    function update() {
      const remaining = targetDate - Date.now();

      if (remaining <= 0) {
        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";
        clearInterval(window.weddingCountdown);
        return;
      }

      days.textContent = String(
        Math.floor(remaining / (1000 * 60 * 60 * 24))
      ).padStart(2, "0");

      hours.textContent = String(
        Math.floor((remaining / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0");

      minutes.textContent = String(
        Math.floor((remaining / (1000 * 60)) % 60)
      ).padStart(2, "0");

      seconds.textContent = String(
        Math.floor((remaining / 1000) % 60)
      ).padStart(2, "0");
    }

    update();
    clearInterval(window.weddingCountdown);
    window.weddingCountdown = setInterval(update, 1000);
  }

  // ---------------------------------------
  // SCRATCH CARD
  // ---------------------------------------

  function setupScratchCard() {
    const canvas = document.getElementById("scratchCanvas");
    const revealButton = document.getElementById("revealButton");

    if (!canvas || canvas.dataset.ready === "yes") return;
    canvas.dataset.ready = "yes";

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true
    });

    if (!ctx) {
      revealButton.addEventListener("click", reveal);
      return;
    }

    let scratching = false;
    let previousPoint = null;
    let isRevealed = false;
    let lastCheck = 0;

    function drawCover() {
      if (isRevealed) return;

      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const ratio = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#d7bd91");
      gradient.addColorStop(0.5, "#b78e58");
      gradient.addColorStop(1, "#e7d5b4");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.font = "600 12px Montserrat, sans-serif";
      ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 - 5);

      ctx.font = "27px Georgia, serif";
      ctx.fillText("✧", rect.width / 2, rect.height / 2 + 35);

      ctx.globalCompositeOperation = "destination-out";
    }

    function pointFromEvent(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    function scratch(point) {
      if (!previousPoint) {
        previousPoint = point;
        return;
      }

      ctx.beginPath();
      ctx.lineWidth = 36;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(previousPoint.x, previousPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      previousPoint = point;

      const now = Date.now();
      if (now - lastCheck > 400) {
        lastCheck = now;
        checkProgress();
      }
    }

    function checkProgress() {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clearPixels = 0;
      let sampled = 0;

      // Sample every 16th pixel for better performance.
      for (let i = 3; i < image.data.length; i += 16) {
        sampled++;
        if (image.data[i] < 50) clearPixels++;
      }

      if (sampled && clearPixels / sampled > 0.40) {
        reveal();
      }
    }

    function reveal() {
      if (isRevealed) return;
      isRevealed = true;
      canvas.classList.add("revealed");
    }

    canvas.addEventListener("pointerdown", function (event) {
      if (isRevealed) return;

      scratching = true;
      previousPoint = pointFromEvent(event);

      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!scratching || isRevealed) return;
      scratch(pointFromEvent(event));
      event.preventDefault();
    });

    function stopScratch() {
      scratching = false;
      previousPoint = null;
    }

    canvas.addEventListener("pointerup", stopScratch);
    canvas.addEventListener("pointercancel", stopScratch);
    canvas.addEventListener("lostpointercapture", stopScratch);

    revealButton.addEventListener("click", reveal);

    drawCover();

    window.addEventListener("resize", function () {
      if (!isRevealed) drawCover();
    });
  }

  // ---------------------------------------
  // OPTIONAL BACKGROUND MUSIC
  // Add assets/wedding-music.mp3
  // ---------------------------------------

  const music = document.getElementById("weddingMusic");
  const musicButton = document.getElementById("musicButton");
  const musicText = document.getElementById("musicText");
  const musicIcon = document.getElementById("musicIcon");

  let playing = false;

  musicButton.addEventListener("click", async function () {
    if (!music) return;

    if (!playing) {
      try {
        await music.play();
        playing = true;
        musicText.textContent = "Pause music";
        musicIcon.textContent = "♫";
      } catch (error) {
        musicText.textContent = "Add music file";
        console.warn("Music could not start. Check assets/wedding-music.mp3", error);
      }
    } else {
      music.pause();
      playing = false;
      musicText.textContent = "Play music";
      musicIcon.textContent = "♫";
    }
  });
});
