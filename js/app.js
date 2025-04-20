// Main application JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Tagħlima application initialized');
    
    // Initialize components
    initNavigation();
    initAuthModal();
  });
  
  // Navigation functionality
  function initNavigation() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100, // Adjust for header
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Handle "Get Started" button
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        openAuthModal('signup');
      });
    }
    
    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
      });
    }
    
    // "Try Demo" button
    const demoBtn = document.getElementById('demo-btn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        // Redirect to demo page or show demo content
        window.location.href = 'demo.html';
      });
    }
  }
  
  // Initialize the modal for login/signup
  function initAuthModal() {
    const modal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const signupCtaBtn = document.getElementById('signup-cta-btn');
    const closeBtn = document.querySelector('.close-btn');
    const authTabs = document.querySelectorAll('.auth-tab');
    
    // Open modal with login form
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        openAuthModal('login');
      });
    }
    
    // Open modal with signup form
    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        openAuthModal('signup');
      });
    }
    
    // Open modal with signup form (CTA button)
    if (signupCtaBtn) {
      signupCtaBtn.addEventListener('click', () => {
        openAuthModal('signup');
      });
    }
    
    // Close modal when clicking the close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeAuthModal();
      });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAuthModal();
      }
    });
    
    // Tab switching functionality
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabType = tab.getAttribute('data-tab');
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding form
        document.querySelectorAll('.auth-form').forEach(form => {
          form.classList.remove('active');
        });
        document.getElementById(`${tabType}-form`).classList.add('active');
      });
    });
    
    // Handle form submissions
    const loginForm = document.querySelector('#login-form form');
    const signupForm = document.querySelector('#signup-form form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // In a real app, you would authenticate with a server here
        console.log('Login attempt:', { email, password });
        
        // For demo purposes, simulate successful login
        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
      });
    }
    
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        // In a real app, you would register the user with a server here
        console.log('Signup attempt:', { name, email, password });
        
        // For demo purposes, simulate successful registration
        alert('Account created successfully! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
      });
    }
  }
  
  // Open the auth modal with the specified tab active
  function openAuthModal(tabType) {
    const modal = document.getElementById('auth-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    // Set active tab
    authTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabType) {
        tab.click();
      }
    });
  }
  
  // Close the auth modal
  function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }

  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks  = document.getElementById('nav-links');
    const overlay   = document.getElementById('nav-overlay');
  
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active')
        ? 'hidden' : '';
    });
  
    overlay?.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  
    // close menu on link click
    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  
    // ensure desktop view resets on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  