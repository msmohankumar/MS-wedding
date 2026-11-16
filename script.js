document.addEventListener("DOMContentLoaded", () => {
  const revealButton = document.getElementById("revealDate");
  const opening = document.getElementById("opening");
  const story = document.getElementById("story");
  const backTop = document.getElementById("backTop");
  let revealed = false;

  // First tap reveals the dates; second tap opens the wedding story.
  revealButton.addEventListener("click", () => {
    if (!revealed) {
      revealed = true;
      revealButton.classList.add("is-revealed");
      revealButton.setAttribute("aria-expanded", "true");
      revealButton.querySelector(".reveal-prompt").textContent = "TAP AGAIN TO EXPLORE OUR STORY";
      return;
    }
    opening.classList.add("opening-exit");
    story.classList.add("visible");
    story.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      opening.hidden = true;
      story.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  });

  // Countdown to 12 November 2026, 6:30 PM India time.
  const target = new Date("2026-11-12T18:30:00+05:30").getTime();
  const fields = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };
  function updateCountdown() {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      Object.values(fields).forEach(el => el.textContent = "00");
      clearInterval(countdownTimer);
      return;
    }
    fields.days.textContent = String(Math.floor(remaining / 86400000)).padStart(2, "0");
    fields.hours.textContent = String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0");
    fields.minutes.textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
    fields.seconds.textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  }
  updateCountdown();
  const countdownTimer = window.setInterval(updateCountdown, 1000);

  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});
