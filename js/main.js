// js/main.js - no import, using global auth and db
document.querySelector('#signup-form form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    await db.collection("users").doc(userCred.user.uid).set({
      name,
      email,
      createdAt: new Date()
    });
    alert("Signed up successfully!");
    closeModal();
  } catch (error) {
    alert(error.message);
  }
});

document.querySelector('#login-form form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("Logged in successfully!");
    closeModal();
  } catch (error) {
    alert(error.message);
  }
});

auth.onAuthStateChanged(async (user) => {
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const navLinks = document.getElementById('nav-links');

  if (user) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';

    if (!document.getElementById('logout-btn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = 'Log Out';
      logoutBtn.className = 'btn btn-outline';
      logoutBtn.id = 'logout-btn';
      navLinks.appendChild(logoutBtn);

      logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => alert("Logged out!"));
      });
    }

    const docSnap = await db.collection("users").doc(user.uid).get();
    if (docSnap.exists) {
      console.log("User name:", docSnap.data().name);
    }
  } else {
    loginBtn.style.display = 'inline-block';
    signupBtn.style.display = 'inline-block';
    document.getElementById('logout-btn')?.remove();
  }
});

function closeModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
