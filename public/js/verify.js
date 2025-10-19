const form = document.getElementById("verifyForm");
const msg = document.getElementById("statusMsg");

const email = localStorage.getItem("pendingEmail");

if (!email) {
  window.location.href = "/register.html";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.innerHTML = "<div class='text-info'>در حال بررسی کد...</div>";

  const code = document.getElementById("code").value.trim();

  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (data.success) {
      msg.innerHTML = `<div class='text-success fw-bold animate__animated animate__fadeIn'>✅ ${data.message}</div>`;
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      setTimeout(() => (window.location.href = "/index.html"), 1500);
    } else {
      msg.innerHTML = `<div class='text-danger animate__animated animate__shakeX'>${data.error}</div>`;
    }
  } catch (err) {
    msg.innerHTML = "<div class='text-danger'>❌ خطا در ارتباط با سرور</div>";
  }
});
