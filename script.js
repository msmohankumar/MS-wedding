// Wedding date is interpreted in India Standard Time (UTC+05:30).
const weddingDate = new Date("2026-11-18T00:00:00+05:30").getTime();

function updateCountdown() {
  const remaining = weddingDate - Date.now();
  const values = remaining <= 0
    ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
    : {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
      };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.getElementById(key);
    if (node) node.textContent = String(value).padStart(2, "0");
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Optional RSVP address: replace the empty value with your email address.
const rsvpEmail = "";
const rsvpLink = document.getElementById("rsvpLink");
if (rsvpEmail && rsvpLink) {
  rsvpLink.href = `mailto:${rsvpEmail}?subject=${encodeURIComponent("Wedding RSVP - Mohan Kumar & Priyanka")}`;
}

// Music control is intentionally silent until you add an audio file you have permission to use.
// Add your own file at assets/wedding-music.mp3 and uncomment the audio element below.
// const music = new Audio("./assets/wedding-music.mp3");
// music.loop = true;
// document.getElementById("musicToggle")?.addEventListener("click", async () => {
//   const button = document.getElementById("musicToggle");
//   if (music.paused) { await music.play(); button.classList.add("playing"); }
//   else { music.pause(); button.classList.remove("playing"); }
// });
document.getElementById("musicToggle")?.addEventListener("click", () => {
  alert("Add your own licensed wedding-music file to assets and enable the audio code in script.js.");
});
