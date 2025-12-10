let usernameEl = document.querySelector("#username");
let emailEl = document.querySelector("#email");
let passwordEl = document.querySelector("#password");
const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const formElement = document.forms[0];
let isValid = true;

usernameEl.addEventListener("input", usernameVal);
emailEl.addEventListener("input", emailVal);
passwordEl.addEventListener("input", passwordVal);
function usernameVal() {
  // Username Validation
  const value = usernameEl.value;
  if (value.length < 3 || value.length > 15) {
    usernameError.textContent = "Username must be 3-15 characters long.";
    usernameEl.style.backgroundColor = "rgb(255, 222, 227)";
    isValid = false;
  } else {
    usernameError.textContent = "";
    usernameEl.style.backgroundColor = "rgba(149, 255, 149, 1)";
    isValid = true;
    usernameEl.value = sanitizeString(value);
  }
}
function emailVal() {
  // Email Validation
  const value = emailEl.value;
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailPattern.test(value)) {
    emailError.textContent = "Please enter a valid email address.";
    emailEl.style.backgroundColor = "rgb(255, 222, 227)";
    isValid = false;
  } else {
    emailError.textContent = "";
    emailEl.style.backgroundColor = "rgba(149, 255, 149, 1)";
    isValid = true;
  }
}
function passwordVal() {
  // Password Validation
  const value = passwordEl.value;
  if (value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters long.";
    passwordEl.style.backgroundColor = "rgb(255, 222, 227)";
    isValid = false;
  } else {
    passwordError.textContent = "";
    passwordEl.style.backgroundColor = "rgba(149, 255, 149, 1)";
    isValid = true;
  }
}

formElement.addEventListener("submit", function (e) {
  // stop the form from doing the default action.
  if (!isValid) {
    e.preventDefault();
  }
});
function sanitizeString(input) {
  console.log(input);
  let sanitized = "";
  // Loop through each character in the string
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    switch (char) {
      case "<":
        sanitized += "&lt;";
        break;
      case ">":
        sanitized += "&gt;";
        break;
      case '"':
        sanitized += "&quot;";
        break;
      case "'":
        sanitized += "&#39;";
        break;
      case "&":
        sanitized += "&amp;";
        break;
      default:
        sanitized += char;
    }
  }
  console.log(sanitized);
  return sanitized;
}
