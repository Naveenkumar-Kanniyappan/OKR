document.addEventListener("DOMContentLoaded", () => {
  let imageCenter = document.querySelector(".image-center");
  let addOkrBtn = document.querySelector(".add-okr");
  let registerContainer = document.querySelector(".register-container");
  let form = document.querySelector(".register-form");
  let userListDiv = document.querySelector(".user-list");
  let userDetailsDiv = document.querySelector(".user-details");
  let backBtn = document.querySelector(".btn-back");
  let nextBtn = document.querySelector(".btn-submit");

  // // showAllBtn.style.display = "none";
  // userListDiv.style.display = "flex";

  let currentStep = 1;
  updateStepUI();

  function setActiveStep(stepNumber) {
    let steps = document.querySelectorAll(".step");
    steps.forEach((step, index) => {
      let circle = step.querySelector(".step-circle");
      circle.classList.remove("active", "completed");

      if (index < stepNumber - 1) {
        circle.classList.add("completed");
      } else if (index === stepNumber - 1) {
        circle.classList.add("active");
      }
    });
  }

  function updateStepUI() {
    imageCenter.style.display = currentStep === 1 ? "flex" : "none";
    registerContainer.style.display = currentStep === 2 ? "flex" : "none";
    userListDiv.style.display = currentStep === 3 ? "flex" : "none";
    setActiveStep(currentStep);
  }

  addOkrBtn.addEventListener("click", (e) => {
    e.preventDefault();
    currentStep = 2;
    updateStepUI();
    userDetailsDiv.innerHTML = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let address = document.getElementById("address").value.trim();
    let location = document.getElementById("location").value.trim();
    let username = document.getElementById("uname1").value.trim();
    let email = document.getElementById("email").value.trim();
    let password1 = document.getElementById("upswd1").value.trim();
    let password2 = document.getElementById("upswd2").value.trim();

    if (!name || !mobile || !address || !location || !username || !email || !password1 || !password2) {
      alert("Please fill in all fields.");
      return;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Enter a valid email.");
      return;
    }

    let phonePattern = /^\d{10}$/;
    if (!phonePattern.test(mobile)) {
      alert("Enter a valid 10-digit mobile number.");
      return;
    }

    if (password1 !== password2) {
      alert("Passwords do not match.");
      return;
    }

    let okrData = {
      name,
      mobile,
      address,
      location,
      username,
      email,
      password: password1
    };

    let okrList = JSON.parse(localStorage.getItem("okrList")) || [];
    okrList.push(okrData);
    localStorage.setItem("okrList", JSON.stringify(okrList));

    alert("OKR saved to localStorage!");

    currentStep = 3;
    updateStepUI();
    showAllUsers();
  });

  function showAllUsers() {
    userListDiv.innerHTML = "";
    userDetailsDiv.innerHTML = "";

    let okrList = JSON.parse(localStorage.getItem("okrList")) || [];

    if (okrList.length === 0) {
      userListDiv.innerHTML = "<p>No users found.</p>";
      return;
    }

    let ol = document.createElement("ol");
    okrList.forEach(user => {
      let li = document.createElement("li");
      li.textContent=`${user.name}`
      
      let btn = document.createElement("button");
      btn.innerHTML = `<i class="fa-solid fa-circle-chevron-down"></i>`
      btn.className = "user-name";
      btn.style.margin = "5px";
      btn.style.padding = "5px 10px";
      btn.style.cursor = "pointer";

      function showUserListDiv(){

      userDetailsDiv.innerHTML = `
      <div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc;">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Mobile:</strong> ${user.mobile}</p>
        <p><strong>Address:</strong> ${user.address}</p>
        <p><strong>Location:</strong> ${user.location}</p>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      </div>
    `;
      }

      btn.addEventListener("click", () => {
        showUserListDiv();
      });


      ol.append(li);
      li.append(btn);
      userListDiv.append(ol);
      
    });
  }

    currentStep = 3;
    updateStepUI();
    showAllUsers();

  backBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentStep < 3) {
      currentStep++;
      updateStepUI();
    }
  });
});
