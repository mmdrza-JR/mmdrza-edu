document.addEventListener("mousemove", (e) => {
  const box = document.querySelector(".glass-box");
  if (!box) return;
  const rect = box.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  box.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(56,189,248,0.15), rgba(10,20,40,0.9))`;
});

document.querySelectorAll(".btn-neon").forEach((btn) => {
  btn.addEventListener("click", () => {
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3");
    audio.volume = 0.3;
    audio.play();
  });
});
