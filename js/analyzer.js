// LOGIN CHECK
if (!localStorage.getItem("nexlockUser")) {
  window.location.href = "login.html";
}

/* ANALYZE PASSWORD */

function analyzePassword() {
  const input = document.getElementById("passwordInput");

  if (!input) return;

  const password = input.value.trim();

  if (!password) {
    alert("Please enter password");
    return;
  }

  const length = password.length;

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*]/.test(password);

  let score = 0;

  /* ================= LENGTH SCORE ================= */
  /* Tier based so score doesn't stack too much */

  if (length < 4) score += 5;
  else if (length < 6) score += 10;
  else if (length < 8) score += 20;
  else if (length < 10) score += 30;
  else if (length < 12) score += 40;
  else if (length < 16) score += 50;
  else score += 60;

  /* ================= CHARACTER TYPE COUNT ================= */

  let typeCount = 0;

  if (hasLower) typeCount++;
  if (hasUpper) typeCount++;
  if (hasNumber) typeCount++;
  if (hasSymbol) typeCount++;

  /* ================= TYPE SCORE ================= */

  if (typeCount === 1) {
    score += 0; // only length matters
  } else if (typeCount === 2) {
    score += 20;
  } else if (typeCount === 3) {
    score += 30;
  } else if (typeCount === 4) {
    score += 40;
  }

  /* ================= TYPE BONUS ================= */

  if (typeCount >= 3) score += 10;
  if (typeCount === 4) score += 10;

  /* ================= ARRANGEMENT BONUS ================= */

  if (hasUpper && hasLower) score += 5;
  if (hasNumber && hasSymbol) score += 5;

  /* ================= LIMIT SCORE ================= */

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  /* ================= STRENGTH LEVEL ================= */

  let strength = "Very Weak";

  if (score >= 90) strength = "Excellent";
  else if (score >= 75) strength = "Very Strong";
  else if (score >= 60) strength = "Strong";
  else if (score >= 45) strength = "Good";
  else if (score >= 30) strength = "Fair";
  else if (score >= 15) strength = "Weak";

  /* PROGRESS BAR */
  let bar = document.getElementById("progressBar");

  if (score >= 75) bar.style.background = "#22c55e";
  else if (score >= 50) bar.style.background = "#3b82f6";
  else if (score >= 30) bar.style.background = "#f59e0b";
  else bar.style.background = "#ef4444";

  /* SHOW RESULT SECTION */

  const resultSection = document.getElementById("resultSection");
  if (resultSection) resultSection.style.display = "block";

  /* UPDATE UI */

  document.getElementById("strengthText").innerText = strength;
  document.getElementById("scoreText").innerText = score + " / 100";
  document.getElementById("progressBar").style.width = score + "%";
  document.getElementById("displayPassword").innerText = password;

  document.getElementById("lengthValue").innerText = length;

  document.getElementById("uppercaseValue").innerHTML = hasUpper
    ? "<span class='yes'>Yes</span>"
    : "<span class='no'>No</span>";

  document.getElementById("lowercaseValue").innerHTML = hasLower
    ? "<span class='yes'>Yes</span>"
    : "<span class='no'>No</span>";

  document.getElementById("numberValue").innerHTML = hasNumber
    ? "<span class='yes'>Yes</span>"
    : "<span class='no'>No</span>";

  document.getElementById("symbolValue").innerHTML = hasSymbol
    ? "<span class='yes'>Yes</span>"
    : "<span class='no'>No</span>";

  /* STORE IN LOCAL STORAGE */

  let analyzed = JSON.parse(localStorage.getItem("analyzedPasswords")) || [];

  const exists = analyzed.find((item) => item.password === password);

  if (!exists) {
    analyzed.push({
      password: password,
      strength: strength,
      score: score,
      length: length,
      hasUpper: hasUpper,
      hasLower: hasLower,
      hasNumber: hasNumber,
      hasSymbol: hasSymbol,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem("analyzedPasswords", JSON.stringify(analyzed));
  }
}

/* COPY PASSWORD */

function copyPassword(password) {
  navigator.clipboard.writeText(password);

  const popup = document.getElementById("copyPopup");

  if (!popup) return;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}
