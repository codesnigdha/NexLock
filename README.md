# 🔐 NexLock

**NexLock** is a web application designed to help users create and evaluate secure passwords.
It generates passwords based on **user information (name and date of birth)** combined with defined security rules, and also provides a **password strength analysis tool**.

The application includes **user authentication, a dashboard for storing records, and account management**, with all data stored using **browser Local Storage**.

---

## 📖 Description

Weak passwords are one of the most common security risks. NexLock addresses this by allowing users to generate stronger passwords and analyze their existing passwords for security issues.

To maintain privacy and simplicity, the project stores user information and generated password records using **Local Storage**, meaning the application runs entirely on the client side without requiring a backend server.

---

## ⚡ Core Functionalities

### Password Generator

* Generates passwords based on:
  * Name
  * Date of Birth
  * Security rules
* Creates stronger password combinations.

### Password Analyzer

* Checks password strength.
* Evaluates factors such as:

  * Password length
  * Character diversity
  * Overall security level.

### Authentication System

* Signup page for creating new users.
* Login page for accessing the platform.
* Ensures that protected pages are accessible only after login.

### Dashboard

* Stores generated password data.
* Displays saved information for the logged-in user.
* Data is stored in **Local Storage**.

### Access Protection

If the user is **not logged in**, they cannot access:

* Password Generator
* Password Analyzer
* Dashboard

### Account Management

* Logout option
* Delete account option

---

## 🧰 Technologies Used

* **HTML5** – Structure of the website
* **CSS3** – Styling and layout
* **JavaScript** – Application logic and functionality
* **Local Storage API** – Client-side data storage

---

## 📂 Project Pages

* `index.html` – Home page
* `login.html` – Login interface
* `signup.html` – Account creation page
* `generator.html` – Password generator
* `analyzer.html` – Password analyzer
* `dashboard.html` – User dashboard

---

📁 Project Structure
NexLock
│
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── generate.html
├── analyze.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│   └── auth-check.js
│   └── generator.js
│   └── analyzer.js
│   └── dashboard.js
│
└── assets/
    └── bg.jpg
    └── logo.png

---

## 💾 Storage Method

The application uses **browser Local Storage** to store:

* User account information
* Generated password history
* Dashboard data

This allows the project to function **without a backend database**.

---

## 👩‍💻 Author

**Snigdha Samanta**

