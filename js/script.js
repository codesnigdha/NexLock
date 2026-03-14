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

// ================= NAVBAR + POPUP =================

window.onload = function () {
  let user = localStorage.getItem("loggedUser");
  let navbar = document.getElementById("navbarLinks");

  if (user && navbar) {
    navbar.innerHTML = `
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
        </div>
      `;
  }

  if (user && localStorage.getItem("showWelcome")) {
    let popup = document.getElementById("welcomePopup");
    let text = document.getElementById("welcomeText");

    if (popup && text) {
      text.innerText = "Welcome " + user + " to NexLock 🔐";

      popup.style.display = "flex";

      setTimeout(() => {
        popup.style.display = "none";
      }, 2000);

      localStorage.removeItem("showWelcome");
    }
  }
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
  if (popup) popup.style.display = "flex";
}

// ================= CONFIRM DELETE =================

function confirmClear() {
  localStorage.removeItem("nexlockUser");
  localStorage.removeItem("loggedUser");

  closeClearPopup();

  alert("Account deleted");

  window.location.href = "signup.html";
}

// ================= CLOSE DELETE POPUP =================

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
