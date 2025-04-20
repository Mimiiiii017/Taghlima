// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('TalMalti dashboard initialized');
    
    // Initialize dashboard components
    initUserData();
    initDashboardActions();
    checkDailyStreak();
  });
  
  // Initialize user data (would come from backend in production)
  function initUserData() {
    // For demo purposes, we're using hardcoded data
    // In a real app, this would come from your authentication system
    const userData = {
      name: 'Maria',
      avatar: 'images/avatar-placeholder.png',
      streak: 5,
      xp: 350,
      level: 3,
      dailyXP: 70,
      dailyGoal: 100,
      completedLessons: ['lesson-1'],
      inProgressLessons: ['lesson-2'],
      achievements: ['first-perfect-score', 'three-day-streak']
    };
    
    // Update UI with user data
    document.querySelector('.username').textContent = userData.name;
    document.getElementById('streak-count').textContent = userData.streak;
    document.getElementById('xp-count').textContent = userData.xp;
    document.getElementById('level-count').textContent = userData.level;
    
    // Update daily goal progress
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = (userData.dailyXP / userData.dailyGoal) * 100;
    progressFill.style.width = `${progressPercent}%`;
    document.querySelector('.progress-info').textContent = `${userData.dailyXP} / ${userData.dailyGoal} XP today`;
  }
  
  // Initialize dashboard button actions
  function initDashboardActions() {
    // Continue learning button
    const continueBtn = document.querySelector('.daily-goal .btn-primary');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        window.location.href = 'lessons.html';
      });
    }
    
    // Play now button for daily challenge
    const playNowBtn = document.querySelector('.daily-challenge .btn-secondary');
    if (playNowBtn) {
      playNowBtn.addEventListener('click', () => {
        window.location.href = 'games.html';
      });
    }
    
    // Lesson items click
    const lessonItems = document.querySelectorAll('.lesson-item');
    lessonItems.forEach(item => {
      item.addEventListener('click', () => {
        // Extract lesson number from text content
        const lessonTitle = item.querySelector('h3').textContent;
        const lessonNumber = lessonTitle.match(/Lesson (\d+)/)[1];
        window.location.href = `lesson${lessonNumber}.html`;
      });
      
      // Make lesson items look clickable
      item.style.cursor = 'pointer';
    });
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real app, you would clear the auth token
        alert('Logging out...');
        window.location.href = 'index.html';
      });
    }
  }
  
  // Check if user has completed their daily activity
  function checkDailyStreak() {
    // In a real app, this would check the last login date
    // and update the streak accordingly
    const lastActive = localStorage.getItem('lastActive');
    const today = new Date().toDateString();
    
    if (lastActive !== today) {
      localStorage.setItem('lastActive', today);
      // In a real app, you would update the streak on the server
    }
  }
  
  // Update XP when activities are completed
  function updateXP(amount) {
    const xpElement = document.getElementById('xp-count');
    const currentXP = parseInt(xpElement.textContent);
    const newXP = currentXP + amount;
    
    xpElement.textContent = newXP;
    
    // Check if the user has leveled up
    checkLevelUp(newXP);
    
    // Update daily goal progress
    updateDailyGoal(amount);
  }
  
  // Check if user should level up
  function checkLevelUp(totalXP) {
    // Simple leveling system: each level requires level * 100 XP
    const levelElement = document.getElementById('level-count');
    const currentLevel = parseInt(levelElement.textContent);
    const nextLevelRequirement = currentLevel * 100;
    
    if (totalXP >= nextLevelRequirement) {
      levelElement.textContent = currentLevel + 1;
      showLevelUpNotification(currentLevel + 1);
    }
  }
  
  // Show level up notification
  function showLevelUpNotification(newLevel) {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🎉</div>
        <div class="notification-text">
          <h3>Level Up!</h3>
          <p>Congratulations! You've reached level ${newLevel}!</p>
        </div>
        <button class="close-notification">×</button>
      </div>
    `;
    
    // Add to the document
    document.body.appendChild(notification);
    
    // Add animation class after a short delay
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove after a few seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.close-notification').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    });
  }
  
  // Update daily goal progress
  function updateDailyGoal(amount) {
    const progressInfo = document.querySelector('.progress-info');
    const progressText = progressInfo.textContent;
    const currentValues = progressText.match(/(\d+) \/ (\d+)/);
    
    if (currentValues && currentValues.length === 3) {
      const currentXP = parseInt(currentValues[1]);
      const goalXP = parseInt(currentValues[2]);
      const newXP = currentXP + amount;
      
      // Update the text
      progressInfo.textContent = `${newXP} / ${goalXP} XP today`;
      
      // Update the progress bar
      const progressPercent = (newXP / goalXP) * 100;
      const progressFill = document.querySelector('.progress-fill');
      progressFill.style.width = `${progressPercent}%`;
      
      // Check if goal reached
      if (newXP >= goalXP && currentXP < goalXP) {
        showGoalCompletedNotification();
      }
    }
  }
  
  // Show goal completed notification
  function showGoalCompletedNotification() {
    // Similar to level up notification
    const notification = document.createElement('div');
    notification.className = 'goal-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🎯</div>
        <div class="notification-text">
          <h3>Daily Goal Completed!</h3>
          <p>You've reached your daily XP goal! Keep going for bonus XP!</p>
        </div>
        <button class="close-notification">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
    
    notification.querySelector('.close-notification').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    });
  }