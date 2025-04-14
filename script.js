document.addEventListener("DOMContentLoaded", () => {
  let formData = document.querySelector(".register-form");
  let userListBox = document.querySelector(".user-list");
  let userDetailBox = document.querySelector(".user-details");
  let okrButton = document.querySelector(".add-okr");
  let imageBox = document.querySelector(".image-center");
  let formBox = document.querySelector(".register-container");
  let backButton = document.querySelector(".btn-back");
  let nextButton = document.querySelector(".btn-submit");

  let stepCount = 1;

  showStep();
  loadSavedForm();

  function showStep() {
    imageBox.style.display = stepCount === 1 ? "flex" : "none";
    formBox.style.display = stepCount === 2 ? "flex" : "none";
    userListBox.style.display = stepCount === 3 ? "flex" : "none";

    document.querySelectorAll(".step-circle").forEach((circle, index) => {
      circle.classList.remove("active", "completed");
      if (index < stepCount - 1) circle.classList.add("completed");
      else if (index === stepCount - 1) circle.classList.add("active");
    });
  }

  okrButton.addEventListener("click", () => {
    stepCount = 2;
    showStep();
  });

  formData.addEventListener("input", () => {
    let data = {};
    formData.querySelectorAll("input").forEach(input => {
      data[input.id] = input.value;
    });
    sessionStorage.setItem("formTemp", JSON.stringify(data));
  });

  function loadSavedForm() {
    let saved = sessionStorage.getItem("formTemp");
    if (saved) {
      let data = JSON.parse(saved);
      for (let key in data) {
        let input = document.getElementById(key);
        if (input) input.value = data[key];
      }
    }
  }

  formData.addEventListener("submit", e => {
    e.preventDefault();

    let name = formData.name.value.trim();
    let phone = formData.mobile.value.trim();
    let addr = formData.address.value.trim();
    let city = formData.location.value.trim();
    let user = formData.uname1.value.trim();
    let email = formData.email.value.trim();
    let pass1 = formData.upswd1.value.trim();
    let pass2 = formData.upswd2.value.trim();

    if (!name || !phone || !addr || !city || !user || !email || !pass1 || !pass2) {
      alert("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Enter a valid email.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number.");
      return;
    }

    if (pass1 !== pass2) {
      alert("Passwords do not match.");
      return;
    }

    let userData = { name, phone, addr, city, user, email, password: pass1 };
    let userList = JSON.parse(sessionStorage.getItem("userList")) || [];
    userList.push(userData);
    sessionStorage.setItem("userList", JSON.stringify(userList));
    sessionStorage.removeItem("formTemp");

    formData.reset();
    stepCount = 3;
    showStep();
    showUsers();
  });

  function showUsers() {
    userListBox.innerHTML = "";
    userDetailBox.innerHTML = "";
    let userList = JSON.parse(sessionStorage.getItem("userList")) || [];

    if (userList.length === 0) {
      userListBox.innerHTML = "<p>No users found.</p>";
      return;
    }

    let list = document.createElement("ol");
    userList.forEach(user => {
      let item = document.createElement("li");
      item.textContent = user.name;

      let button = document.createElement("button");
      button.innerHTML = `<i class="fa-solid fa-circle-chevron-down"></i>`;
      button.className = "user-name";
      button.style.margin = "5px";
      button.style.padding = "5px 10px";

      button.addEventListener("click", () => {
        userDetailBox.innerHTML = `
          <div style="margin-top:10px; padding:10px; border:1px solid #ccc;">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Mobile:</strong> ${user.phone}</p>
            <p><strong>Address:</strong> ${user.addr}</p>
            <p><strong>Location:</strong> ${user.city}</p>
            <p><strong>Username:</strong> ${user.user}</p>
            <p><strong>Email:</strong> ${user.email}</p>
          </div>`;
      });

      item.appendChild(button);
      list.appendChild(item);
    });

    userListBox.appendChild(list);
  }

  backButton.addEventListener("click", () => {
    if (stepCount > 1) {
      stepCount--;
      showStep();
    }
  });

  nextButton.addEventListener("click", () => {
    if (stepCount < 3) {
      stepCount++;
      showStep();
    }
  });

  if (stepCount === 3) {
    showUsers();
  }
});
