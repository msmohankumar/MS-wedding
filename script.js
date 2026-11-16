document.addEventListener("DOMContentLoaded", function () {
  const introScreen = document.getElementById("introScreen");
  const invitationContent = document.getElementById("invitationContent");
  const envelope = document.getElementById("envelope");
  const openInvitation = document.getElementById("openInvitation");
  const skipIntro = document.getElementById("skipIntro");
  const tapHint = document.getElementById("tapHint");

  const music = document.getElementById("weddingMusic");
  const musicButton = document.getElementById("musicButton");
  const musicLabel = document.getElementById("musicLabel");

  let invitationOpened = false;
  let musicPlaying = false;

  // --------------------------------------------------
  // OPEN THE ENVELOPE
  // --------------------------------------------------

  function createPetals() {
    const symbols = ["✿", "❀", "❁", "✾"];

    for (let i = 0; i < 24; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      petal.style.left = Math.random() * 100 + "vw";
      petal.style.fontSize = (12 + Math.random() * 15) + "px";
      petal.style.animationDuration = (4 + Math.random() * 5) + "s";
      petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");

      document.body.appendChild(petal);

      setTimeout(function () {
        petal.remove();
      }, 10000);
    }
  }

  function showInvitation() {
    if (invitationOpened) return;

    invitationOpened = true;

    envelope.classList.add("open");
    tapHint.textContent = "Opening your invitation...";

    createPetals();

    setTimeout(function () {
      introScreen.classList.add("dismissed");
      invitationContent.classList.add("visible");
      invitationContent.setAttribute("aria-hidden", "false");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      startCountdown();
      initialiseScratchCard();
    }, 1600);
  }

  openInvitation.addEventListener("click", showInvitation);
  skipIntro.addEventListener("click", showInvitation);

  // --------------------------------------------------
  // COUNTDOWN
  // Wedding date: 18 November 2026
  // India time: UTC +05:30
  // --------------------------------------------------

  function startCountdown() {
    const weddingDate = new Date("2026-11-18T00:00:00+05:30").getTime();

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    function updateCountdown() {
      const now = Date.now();
      const distance = weddingDate - now;

      if (distance <= 0) {
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      daysElement.textContent = String(days).padStart(2, "0");
      hoursElement.textContent = String(hours).padStart(2, "0");
      minutesElement.textContent = String(minutes).padStart(2, "0");
      secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();

    if (window.countdownInterval) {
      clearInterval(window.countdownInterval);
    }

    window.countdownInterval = setInterval(updateCountdown, 1000);
  }

  // --------------------------------------------------
  // SCRATCH CARD
  // --------------------------------------------------

  function initialiseScratchCard() {
    const canvas = document.getElementById("scratchCanvas");
    const revealButton = document.getElementById("revealScratch");

    if (!canvas || canvas.dataset.initialised === "true") return;

    canvas.dataset.initialised = "true";

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true
    });

    if (!ctx) {
      revealButton.addEventListener("click", revealCard);
      return;
    }

    let isScratching = false;
    let lastPoint = null;
    let revealed = false;

    function setupCanvas() {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#d8c09a");
      gradient.addColorStop(0.5, "#b9915e");
      gradient.addColorStop(1, "#e3d0ad");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(255,255,255,0.20)";
      ctx.font = "12px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", rect.width / 2, rect.height / 2 - 5);

      ctx.font = "25px Georgia, serif";
      ctx.fillText("✧", rect.width / 2, rect.height / 2 + 35);

      ctx.globalCompositeOperation = "destination-out";
    }

    function getPoint(event) {
      const rect = canvas.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    function scratchTo(point) {
      if (!lastPoint) {
        lastPoint = point;
        return;
      }

      ctx.beginPath();
      ctx.lineWidth = 34;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      lastPoint = point;
      checkScratchProgress();
    }

    function checkScratchProgress() {
      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      let transparentPixels = 0;
      const totalPixels = imageData.data.length / 4;

      // Check every fourth pixel to reduce processing time.
      for (let i = 3; i < imageData.data.length; i += 16) {
        if (imageData.data[i] < 50) {
          transparentPixels++;
        }
      }

      const sampledPixels = Math.ceil(totalPixels / 4);
      const scratchedRatio = transparentPixels / sampledPixels;

      if (scratchedRatio > 0.42) {
        revealCard();
      }
    }

    function revealCard() {
      if (revealed) return;

      revealed = true;
      canvas.classList.add("revealed");
    }

    canvas.addEventListener("pointerdown", function (event) {
      if (revealed) return;

      isScratching = true;
      lastPoint = getPoint(event);

      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!isScratching || revealed) return;

      scratchTo(getPoint(event));
      event.preventDefault();
    });

    function stopScratching() {
      isScratching = false;
      lastPoint = null;
    }

    canvas.addEventListener("pointerup", stopScratching);
    canvas.addEventListener("pointercancel", stopScratching);
    canvas.addEventListener("lostpointercapture", stopScratching);

    revealButton.addEventListener("click", revealCard);

    setupCanvas();

    window.addEventListener("resize", function () {
      if (!revealed) setupCanvas();
    });
  }

  // --------------------------------------------------
  // BACKGROUND MUSIC
  // Music file is optional.
  // Add assets/wedding-music.mp3 to enable it.
  // --------------------------------------------------

  musicButton.addEventListener("click", async function () {
    if (!music) return;

    if (!musicPlaying) {
      try {
        await music.play();
        musicPlaying = true;
        musicLabel.textContent = "Pause music";
        musicButton.setAttribute("aria-label", "Pause background music");
      } catch (error) {
        musicLabel.textContent = "Music unavailable";
        console.warn("Music could not be played. Check the MP3 file path.", error);
      }
    } else {
      music.pause();
      musicPlaying = false;
      musicLabel.textContent = "Play music";
      musicButton.setAttribute("aria-label", "Play background music");
    }
  });

});
