// show or hide the password
var showButton = document.getElementById("show-btn");
if (showButton) {
  showButton.onclick = function () {
    var passwordBox = document.getElementById("password");
    if (passwordBox.type == "password") {
      passwordBox.type = "text";
      showButton.innerText = "Hide";
    } else {
      passwordBox.type = "password";
      showButton.innerText = "Show";
    }
  };
}

// make a random password
var generateButton = document.getElementById("generate-btn");
if (generateButton) {
  generateButton.onclick = function () {
    var letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    var newPassword = "";
    for (var i = 0; i < 16; i++) {
      var randomSpot = Math.floor(Math.random() * letters.length);
      newPassword = newPassword + letters[randomSpot];
    }
    document.getElementById("password").value = newPassword;
    document.getElementById("password").type = "text";
  };
}

// tell the user if their master key is weak, okay or strong
var strengthText = document.getElementById("strength");
if (strengthText) {
  var keyBox = document.getElementById("masterKey");
  keyBox.oninput = function () {
    var key = keyBox.value;

    // check if the key has a number in it
    var hasNumber = false;
    for (var i = 0; i < key.length; i++) {
      if (key[i] >= "0" && key[i] <= "9") {
        hasNumber = true;
      }
    }

    if (key.length == 0) {
      strengthText.innerText = "";
    } else if (key.length < 8) {
      strengthText.innerText = "Strength: weak";
      strengthText.style.color = "red";
    } else if (key.length < 12 || hasNumber == false) {
      strengthText.innerText = "Strength: okay";
      strengthText.style.color = "yellow";
    } else {
      strengthText.innerText = "Strength: strong";
      strengthText.style.color = "#39ff14";
    }
  };
}

// check that both master keys match before signing up
var registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.onsubmit = function () {
    var key = document.getElementById("masterKey").value;
    var confirmKey = document.getElementById("confirmKey").value;
    if (key != confirmKey) {
      alert("Master keys do not match!");
      return false; // stops the form from sending
    }
  };
}

// copy the decrypted password
var copyButton = document.getElementById("copy-btn");
if (copyButton) {
  copyButton.onclick = function () {
    var password = document.getElementById("decrypted").innerText;
    navigator.clipboard.writeText(password)
      .then(function () {
        copyButton.innerText = "Copied!";
      })
      .catch(function (error) {
        console.log("Could not copy: " + error);
        copyButton.innerText = "Copy failed";
      });
  };
}

// hide the decrypted password after 15 seconds
var decrypted = document.getElementById("decrypted");
if (decrypted) {
  var seconds = 15;
  var timerText = document.getElementById("timer");

  var countdown = setInterval(function () {
    seconds = seconds - 1;
    timerText.innerText = "Hiding in " + seconds + " seconds...";

    if (seconds == 0) {
      clearInterval(countdown);
      decrypted.innerText = "****************";
      timerText.innerText = "Hidden. Go back and decrypt again to see it.";
      if (copyButton) {
        copyButton.style.display = "none";
      }
    }
  }, 1000);
}

// ask before deleting
var deleteForm = document.getElementById("delete-form");
if (deleteForm) {
  deleteForm.onsubmit = function () {
    return confirm("Are you sure you want to delete this password?");
  };
}
