// ================= SIGNUP =================

function signup() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let dob = document.getElementById("dob").value;

  if (name === "" || phone === "" || dob === "") {
    alert("Please fill all fields");
    return;
  }

  let user = {
    name: name,
    phone: phone,
    dob: dob,
  };

  localStorage.setItem("nexlockUser", JSON.stringify(user));

  alert("Account created successfully!");
  window.location.href = "login.html";
}

// ================= CAPTCHA =================

let num1 = Math.floor(Math.random() * 10);
let num2 = Math.floor(Math.random() * 10);

if (document.getElementById("captchaQuestion")) {
  document.getElementById("captchaQuestion").textContent =
    num1 + " + " + num2 + " = ?";
}

// ================= LOGIN =================

function login() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let dob = document.getElementById("dob").value;
  let captcha = document.getElementById("captchaInput").value;

  let user = JSON.parse(localStorage.getItem("nexlockUser"));

  if (!user) {
    alert("No account found. Please signup.");
    return;
  }

  if (captcha != num1 + num2) {
    alert("Captcha incorrect");
    return;
  }

  if (user.name === name && user.phone === phone && user.dob === dob) {
    localStorage.setItem("loggedUser", name);
    localStorage.setItem("showWelcome", "true");

    window.location.href = "index.html";
  } else {
    alert("Invalid login details");
  }
}

// ================= WELCOME POPUP =================

const showWelcome = localStorage.getItem("showWelcome");
const user = localStorage.getItem("loggedUser");

if (showWelcome === "true" && user) {
  const popup = document.getElementById("welcomePopup");
  const text = document.getElementById("welcomeText");

  if (popup && text) {
    text.textContent = "Welcome, " + user + " 🎉";

    popup.style.display = "flex";

    setTimeout(() => {
      popup.style.display = "none";
    }, 2000);

    localStorage.removeItem("showWelcome");
  }
}

// ================= NAVBAR + POPUP =================

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

window.onload = function () {
  let user = localStorage.getItem("loggedUser");
  let navLinks = document.getElementById("navbarLinks");
  let sidebarLinks = document.getElementById("sidebarContent");

  // Define content for both views
  let menuHtml = user
    ? `
    <a href="index.html">Home</a>
    <a href="#" onclick="goToGenerate()">Generate</a>
    <a href="#" onclick="goToAnalyze()">Analyze</a>
    <a href="#" onclick="goToDashboard()">Dashboard</a>
    <a href="#" onclick="logout()">Logout</a>
    <a href="#" onclick="deleteAccount()" style="color: #ef4444;">Delete Account</a>
`
    : `
    <a href="login.html">Login</a>
    <a href="signup.html">Signup</a>
`;

  // Make sure you inject it into the sidebar
  document.getElementById("sidebarContent").innerHTML = menuHtml;

  // Populate Desktop (Profile menu remains separate)
  if (user) {
    navLinks.innerHTML = `
          <a href="index.html">Home</a>
          <a href="#" onclick="goToGenerate()">Generate</a>
          <a href="#" onclick="goToAnalyze()">Analyze</a>
          <div class="profile-menu">
              <button onclick="toggleProfile()">Profile ▾</button>
              <div id="profileDropdown" class="profile-dropdown">
                  <a href="#" onclick="goToDashboard()">Dashboard</a>
                  <a href="#" onclick="logout()">Logout</a>
                  <a href="#" onclick="deleteAccount()" class="delete">Delete Account</a>
              </div>
          </div>`;
  } else {
    navLinks.innerHTML = `<a href="login.html">Login</a><a href="signup.html">Signup</a>`;
  }

  // Populate Sidebar
  sidebarLinks.innerHTML = menuHtml;

  // ... (keep your existing welcome popup code below) ...
};

// ================= PROFILE MENU =================

function toggleProfile() {
  const menu = document.getElementById("profileDropdown");
  if (!menu) return;
  menu.classList.toggle("show");
}

// ================= DELETE ACCOUNT POPUP =================

function deleteAccount() {
  const popup = document.getElementById("messagePopup");
  if (popup) {
    popup.style.display = "flex";
  }
}

// YES BUTTON
function confirmClear() {
  // remove user data
  localStorage.removeItem("nexlockUser");
  localStorage.removeItem("loggedUser");

  // close popup
  const popup = document.getElementById("messagePopup");
  if (popup) popup.style.display = "none";

  // redirect to signup
  window.location.replace("signup.html");
}

// NO BUTTON
function closeClearPopup() {
  const popup = document.getElementById("messagePopup");
  if (popup) popup.style.display = "none";
}

// ================= LOGOUT =================

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
}

// ================= CLOSE DROPDOWN =================

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("profileDropdown");
  const button = document.querySelector(".profile-menu button");

  if (!dropdown || !button) return;

  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});
