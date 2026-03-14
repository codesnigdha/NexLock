// ================= LOGIN STATUS =================

function isLoggedIn() {
  return localStorage.getItem("loggedUser");
}

// ================= PROTECT PAGES =================

const protectedPages = ["generator.html", "analyzer.html", "dashboard.html"];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

// ================= POPUP =================

function showAuthPopup() {
  const popup = document.getElementById("authPopup");

  if (popup) {
    popup.style.display = "flex";
    document.body.style.overflow = "hidden"; // block scroll
  }
}

function closeAuthPopup() {
  const popup = document.getElementById("authPopup");

  if (popup) {
    popup.style.display = "none";
    document.body.style.overflow = "auto"; // enable scroll
  }
}

// ================= PROTECTED NAVIGATION =================

function goToGenerate() {
  if (isLoggedIn()) {
    window.location.href = "generator.html";
  } else {
    showAuthPopup();
  }
}

function goToAnalyze() {
  if (isLoggedIn()) {
    window.location.href = "analyzer.html";
  } else {
    showAuthPopup();
  }
}

function goToDashboard() {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
  } else {
    showAuthPopup();
  }
}
