// Certification page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation (this should already be in app.js)
    initMobileNav();
    
    // Initialize progress circle animation
    initProgressCircles();
    
    // Handle partner button clicks
    initPartnerButtons();
  });
  
  // Initialize mobile navigation
  function initMobileNav() {
    // This function might already be in app.js
    // If it's already implemented there, we don't need to duplicate it here
    
    // Just in case it's not in app.js:
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');
    
    if (hamburger && navLinks && navOverlay) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
      });
      
      navOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
      });
    }
  }
  
  // Initialize progress circles
  function initProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    progressCircles.forEach(circle => {
      const percent = parseInt(circle.getAttribute('data-progress'), 10);
      const radius = 54;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percent / 100) * circumference;
      
      const circleElement = circle.querySelector('circle:last-of-type');
      if (circleElement) {
        circleElement.style.strokeDasharray = `${circumference}`;
        circleElement.style.strokeDashoffset = `${offset}`;
      }
    });
  }
  
  // Handle partner button clicks
  function initPartnerButtons() {
    const partnerButtons = document.querySelectorAll('.partner-btn');
    
    partnerButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // For now, prevent default since these are just placeholders
        e.preventDefault();
        
        // In a real implementation, you would redirect to partner websites
        // or show more information
        alert('This would redirect to the partner institution website.');
      });
    });
    
    // Handle CTA buttons
    const contactButton = document.querySelector('.cta-buttons .btn-primary');
    if (contactButton) {
      contactButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // In a real implementation, this could open a contact form modal
        // For now, just show an alert
        alert('This would open a contact form for certification support.');
      });
    }
  }