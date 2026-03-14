// ================= LOGIN CHECK =================

if (!localStorage.getItem("nexlockUser")) {
  window.location.href = "login.html";
}

// ================= DOM ELEMENTS =================

const historyContainer = document.getElementById("passwordHistory");
const analyzeContainer = document.getElementById("analyzeHistory");

// =================================================
// LOAD GENERATED PASSWORD HISTORY
// =================================================

function loadHistory() {
  if (!historyContainer) return;

  const history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

  historyContainer.innerHTML = "";

  if (!history.length) {
    historyContainer.innerHTML =
      "<p class='empty-text'>No passwords saved yet.</p>";
    return;
  }

  history
    .slice()
    .reverse()
    .forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "history-card";

      card.innerHTML = `
      <div class="card-top">
        <h3>${item.firstName} ${item.lastName}</h3>
        <span class="pwd-count">${item.passwords.length} pwds</span>
      </div>

      <p class="dob">DOB: ${item.dob}</p>
      <p class="date">${item.date}</p>

      <div class="card-buttons">
        <button class="view-btn" onclick="viewPasswords(${index})">
          View Passwords
        </button>

        <button class="delete-btn" onclick="deleteItem(${index})">
          Delete
        </button>
      </div>
    `;

      historyContainer.appendChild(card);
    });
}

// =================================================
// VIEW GENERATED PASSWORDS
// =================================================

function viewPasswords(i) {
  const history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

  const data = history[history.length - 1 - i];

  const popup = document.getElementById("passwordPopup");
  const list = document.getElementById("popupPasswords");

  if (!popup || !list) return;

  list.innerHTML = "";

  data.passwords.forEach((pwd) => {
    const item = document.createElement("div");
    item.className = "popup-password-item";

    const span = document.createElement("span");
    span.textContent = pwd;

    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.onclick = () => copyPassword(pwd);

    item.appendChild(span);
    item.appendChild(btn);

    list.appendChild(item);
  });

  popup.style.display = "flex";
}

// =================================================
// COPY PASSWORD
// =================================================

function copyPassword(password) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(password).catch(() => fallbackCopy(password));
  } else {
    fallbackCopy(password);
  }

  const popup = document.getElementById("copyPopup");

  if (!popup) return;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

function fallbackCopy(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}

// =================================================
// CLOSE POPUP
// =================================================

function closePopup() {
  const popup = document.getElementById("passwordPopup");
  if (popup) popup.style.display = "none";
}

// =================================================
// DELETE GENERATED PASSWORD HISTORY
// =================================================

function deleteItem(i) {
  const history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

  history.splice(history.length - 1 - i, 1);

  localStorage.setItem("passwordHistory", JSON.stringify(history));

  loadHistory();
}

// =================================================
// CLEAR ALL HISTORY
// =================================================

function clearAll() {
  const popup = document.getElementById("clearPopup");
  if (popup) popup.style.display = "flex";
}

function confirmClear() {
  localStorage.removeItem("passwordHistory");
  localStorage.removeItem("analyzedPasswords");

  loadHistory();
  loadAnalyzedPasswords();

  closeClearPopup();
}

function closeClearPopup() {
  const popup = document.getElementById("clearPopup");
  if (popup) popup.style.display = "none";
}

// =================================================
// LOAD ANALYZED PASSWORDS
// =================================================

function loadAnalyzedPasswords() {
  if (!analyzeContainer) return;

  const analyzed = JSON.parse(localStorage.getItem("analyzedPasswords")) || [];

  analyzeContainer.innerHTML = "";

  if (!analyzed.length) {
    analyzeContainer.innerHTML =
      "<p class='empty-text'>No passwords analyzed yet.</p>";
    return;
  }

  analyzed
    .slice()
    .reverse()
    .forEach((item, index) => {
      // ---------- TAGS ----------

      const tags = [];

      tags.push(`<span class="tag">${item.password.length} chars</span>`);

      if (/[a-z]/.test(item.password))
        tags.push(`<span class="tag blue">a-z</span>`);
      if (/[A-Z]/.test(item.password))
        tags.push(`<span class="tag blue">A-Z</span>`);
      if (/[0-9]/.test(item.password))
        tags.push(`<span class="tag blue">0-9</span>`);
      if (/[!@#$%^&*]/.test(item.password))
        tags.push(`<span class="tag blue">#</span>`);

      // ---------- STRENGTH COLORS ----------

      let barColor = "#991b1b";
      let strengthColor = "#991b1b";

      if (item.score < 15) {
        barColor = "#991b1b";
        strengthColor = "#991b1b";
      } else if (item.score < 30) {
        barColor = "#dc2626";
        strengthColor = "#dc2626";
      } else if (item.score < 45) {
        barColor = "#f97316";
        strengthColor = "#f97316";
      } else if (item.score < 60) {
        barColor = "#f59e0b";
        strengthColor = "#f59e0b";
      } else if (item.score < 75) {
        barColor = "#3b82f6";
        strengthColor = "#3b82f6";
      } else if (item.score < 90) {
        barColor = "#22c55e";
        strengthColor = "#22c55e";
      } else {
        barColor = "#16a34a";
        strengthColor = "#16a34a";
      }

      // ---------- CARD ----------

      const card = document.createElement("div");
      card.className = "analyze-card";

      card.innerHTML = `
      <div class="analyze-top">

        <div class="analyze-password">
          ${item.password}
        </div>

        <div class="analyze-actions">

          <button class="copy-analyze" data-pwd="${item.password}">
            Copy
          </button>

          <button class="delete-analyze"
                  onclick="deleteAnalyzed(${index})">
            Delete
          </button>

        </div>

      </div>

      <div class="analyze-strength-row">
        <span class="analyze-strength" style="color:${strengthColor}">
          ${item.strength}
        </span>
      </div>

      <div class="analyze-progress">
        <div class="analyze-bar"
             style="width:${item.score}%; background:${barColor}">
        </div>
      </div>

      <div class="analyze-tags">
        ${tags.join("")}
      </div>

      <div class="analyze-date">
        Analyzed · ${item.date}
      </div>
    `;

      analyzeContainer.appendChild(card);

      const copyBtn = card.querySelector(".copy-analyze");
      copyBtn.onclick = () => copyPassword(item.password);
    });
}

// =================================================
// DELETE ANALYZED PASSWORD
// =================================================

function deleteAnalyzed(i) {
  const analyzed = JSON.parse(localStorage.getItem("analyzedPasswords")) || [];

  analyzed.splice(analyzed.length - 1 - i, 1);

  localStorage.setItem("analyzedPasswords", JSON.stringify(analyzed));

  loadAnalyzedPasswords();
}

// =================================================
// TAB SWITCH
// =================================================

function switchTab(tab, btn) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));

  btn.classList.add("active");

  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));

  const content = document.getElementById(tab);
  if (content) content.classList.add("active");

  localStorage.setItem("activeDashboardTab", tab);
}

// =================================================
// RESTORE ACTIVE TAB
// =================================================

function restoreTab() {
  const savedTab = localStorage.getItem("activeDashboardTab");
  if (!savedTab) return;

  const tabButton = document.querySelector(`.tab[onclick*="${savedTab}"]`);

  if (tabButton) switchTab(savedTab, tabButton);
}

// =================================================
// INITIAL LOAD
// =================================================

document.addEventListener("DOMContentLoaded", () => {
  loadHistory();
  loadAnalyzedPasswords();
  restoreTab();
});
