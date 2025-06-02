document.querySelector("#signup-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    await db.collection("users").doc(userCred.user.uid).set({
      name,
      email,
      createdAt: new Date(),
    });
    alert("Signed up successfully!");
  } catch (error) {
    alert(error.message);
  }
});

document.querySelector("#login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("Logged in successfully!");
  } catch (error) {
    alert(error.message);
  }
});

auth.onAuthStateChanged(async (user) => {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const navLinks = document.getElementById("nav-links");

  if (user) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";

    if (!document.querySelector(".user-profile")) {
      const userProfile = document.createElement("div");
      userProfile.className = "user-profile";

      const avatar = document.createElement("img");
      avatar.src = "assets/pfp.jpg";
      avatar.alt = "User Avatar";
      avatar.className = "avatar";

      const username = document.createElement("span");
      username.className = "username";
      username.textContent = "User";

      const logoutBtn = document.createElement("button");
      logoutBtn.textContent = "Log Out";
      logoutBtn.className = "btn btn-outline";
      logoutBtn.id = "logout-btn";

      userProfile.appendChild(avatar);
      userProfile.appendChild(username);
      userProfile.appendChild(logoutBtn);
      navLinks.appendChild(userProfile);

      logoutBtn.addEventListener("click", () => {
        auth.signOut().then(() => alert("Logged out!"));
      });
    }
  } else {
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    document.querySelector(".user-profile")?.remove();
    document.getElementById("logout-btn")?.remove();
  }
});