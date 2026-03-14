// LOGIN CHECK
if (!localStorage.getItem("nexlockUser")) {
  window.location.href = "login.html";
}

/* HIDE PASSWORD BOX INITIALLY */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("passwordResult").style.display = "none";
});

/* RANGE SLIDERS */

const minSlider = document.getElementById("minRange");
const maxSlider = document.getElementById("maxRange");

const minValue = document.getElementById("minValue");
const maxValue = document.getElementById("maxValue");

minValue.textContent = minSlider.value;
maxValue.textContent = maxSlider.value;

/* MIN RANGE */

minSlider.oninput = function () {
  let min = parseInt(minSlider.value);
  let max = parseInt(maxSlider.value);

  if (min >= max) {
    minSlider.value = max;
    min = max;
  }

  minValue.textContent = min;
};

/* MAX RANGE */

maxSlider.oninput = function () {
  let min = parseInt(minSlider.value);
  let max = parseInt(maxSlider.value);

  if (max <= min) {
    maxSlider.value = min;
    max = min;
  }

  maxValue.textContent = max;
};

/* FILTER BUTTONS */

document.querySelectorAll(".filter").forEach((btn) => {
  btn.onclick = () => {
    btn.classList.toggle("active");

    /* IF SPECIAL CHARACTERS FILTER IS TURNED OFF
       CLEAR ALL SELECTED SYMBOLS */

    if (btn.dataset.type === "symbols" && !btn.classList.contains("active")) {
      document.querySelectorAll(".symbol").forEach((symbolBtn) => {
        symbolBtn.classList.remove("active");
      });
    }
  };
});

/* SPECIAL SYMBOL BUTTONS */

document.querySelectorAll(".symbol").forEach((btn) => {
  btn.onclick = () => {
    const useSymbols = document
      .querySelector('[data-type="symbols"]')
      .classList.contains("active");

    if (!useSymbols) {
      alert("Please enable Special Characters filter first.");

      btn.classList.remove("active");

      return;
    }

    btn.classList.toggle("active");
  };
});

/* PASSWORD GENERATOR */

function generatePassword() {
  let first = document.getElementById("firstName").value.trim();
  let last = document.getElementById("lastName").value.trim();
  let dob = document.getElementById("dob").value.trim();

  if (first === "" || dob === "") {
    alert("Please enter name and DOB");
    return;
  }

  const useUpper = document
    .querySelector('[data-type="uppercase"]')
    .classList.contains("active");

  const useLower = document
    .querySelector('[data-type="lowercase"]')
    .classList.contains("active");

  const useNumbers = document
    .querySelector('[data-type="numbers"]')
    .classList.contains("active");

  const useSymbols = document
    .querySelector('[data-type="symbols"]')
    .classList.contains("active");

  if (!useUpper && !useLower && !useNumbers && !useSymbols) {
    alert("Please select at least one filter rule");
    return;
  }

  let min = parseInt(minSlider.value);
  let max = parseInt(maxSlider.value);

  /* SYMBOLS */

  let symbols = "";

  document.querySelectorAll(".symbol.active").forEach((btn) => {
    symbols += btn.innerText;
  });

  if (symbols === "") symbols = "#";

  /* DOB PARTS */

  let dobDay = dob.substring(0, 2);
  let dobMonth = dob.substring(2, 4);
  let dobYear = dob.substring(4);

  /* NAME VARIATIONS */

  let names = [
    first,
    last,
    first.charAt(0).toUpperCase() + first.slice(1),
    last.charAt(0).toUpperCase() + last.slice(1),
    first.toUpperCase(),
    last.toUpperCase(),
    first.toLowerCase(),
    last.toLowerCase(),
  ];

  let dates = [
    dobDay,
    dobMonth,
    dobYear,
    dob,
    dobDay + dobMonth,
    dobMonth + dobYear,
  ];

  let results = [];
  let attempts = 0;

  while (results.length < 5 && attempts < 500) {
    attempts++;

    let name1 = names[Math.floor(Math.random() * names.length)];
    let name2 = names[Math.floor(Math.random() * names.length)];
    let date = dates[Math.floor(Math.random() * dates.length)];
    let symbol = symbols[Math.floor(Math.random() * symbols.length)];

    let patternType = Math.floor(Math.random() * 6);

    let password = "";

    if (patternType === 0) password = name1 + date;
    if (patternType === 1) password = name1 + symbol + date;
    if (patternType === 2) password = date + name1;
    if (patternType === 3) password = name1 + name2 + date;
    if (patternType === 4) password = name1 + symbol + name2 + date;
    if (patternType === 5) password = name1 + date + symbol;

    let length = Math.floor(Math.random() * (max - min + 1)) + min;

    if (password.length > length) {
      password = password.substring(0, length);
    }

    let valid = true;

    if (useUpper && !/[A-Z]/.test(password)) valid = false;
    if (useLower && !/[a-z]/.test(password)) valid = false;
    if (useNumbers && !/[0-9]/.test(password)) valid = false;
    if (useSymbols && !/[!@#$%^&*\-+=]/.test(password)) valid = false;

    if (!useUpper && /[A-Z]/.test(password)) valid = false;
    if (!useLower && /[a-z]/.test(password)) valid = false;
    if (!useNumbers && /[0-9]/.test(password)) valid = false;
    if (!useSymbols && /[!@#$%^&*\-+=]/.test(password)) valid = false;

    if (valid && !results.includes(password)) {
      results.push(password);
    }
  }

  /* DISPLAY PASSWORDS */

  let resultBox = document.getElementById("passwordResult");

  resultBox.innerHTML = "";

  results.forEach((p) => {
    let div = document.createElement("div");

    div.className = "password-item";

    div.innerHTML = `
      <span>${p}</span>
      <button class="copy" onclick="copyPassword('${p}')">Copy</button>
    `;

    resultBox.appendChild(div);
  });

  /* SHOW RESULT BOX */

  resultBox.style.display = "block";

  /* SAVE TO LOCAL STORAGE */

  let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

  first = first.toLowerCase();
  last = last.toLowerCase();

  let existingIndex = history.findIndex(
    (item) =>
      item.firstName === first && item.lastName === last && item.dob === dob
  );

  if (existingIndex !== -1) {
    let existing = history[existingIndex];

    existing.passwords = [...new Set([...existing.passwords, ...results])];

    existing.count = existing.passwords.length;

    existing.date = new Date().toLocaleString();

    history[existingIndex] = existing;
  } else {
    history.push({
      firstName: first,
      lastName: last,
      dob: dob,
      passwords: results,
      count: results.length,
      date: new Date().toLocaleString(),
    });
  }

  localStorage.setItem("passwordHistory", JSON.stringify(history));

  /* UI UPDATE */

  document.getElementById("generateBtn").innerText = "Regenerate Password";

  document.getElementById("firstName").readOnly = true;
  document.getElementById("lastName").readOnly = true;
  document.getElementById("dob").readOnly = true;

  document.getElementById("resetBtn").style.display = "block";
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

/* RESET GENERATOR */

function resetGenerator() {
  document.getElementById("firstName").readOnly = false;
  document.getElementById("lastName").readOnly = false;
  document.getElementById("dob").readOnly = false;

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("dob").value = "";

  document.getElementById("passwordResult").innerHTML = "";

  document.getElementById("passwordResult").style.display = "none";

  document.getElementById("generateBtn").innerText = "Generate Password";

  document.getElementById("resetBtn").style.display = "none";

  document.querySelectorAll(".filter").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.querySelectorAll(".symbol").forEach((btn) => {
    btn.classList.remove("active");
  });

  minSlider.value = 8;
  maxSlider.value = 16;

  minValue.textContent = 8;
  maxValue.textContent = 16;
}
