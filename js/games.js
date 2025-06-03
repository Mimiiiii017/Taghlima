// Games Hub JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('Games Hub initialized');
    
    // Game variables
    let currentGame = null;
    let currentScore = 0;
    let gameTimer = null;
    let timerValue = 60;
    const xpValues = {
      'word-match': 15,
      'fill-blanks': 25,
      'time-challenge': 20,
      'quick-quiz': 10,
      'advanced-word-match': 20,
      'memory-game': 25
    };
    
    // Game elements
    const gameContainer = document.getElementById('game-container');
    const gameArea = document.getElementById('game-area');
    const currentGameTitle = document.getElementById('current-game-title');
    const scoreDisplay = document.getElementById('current-score');
    const timerDisplay = document.getElementById('timer-display');
    const timerValueElement = document.getElementById('timer-value');
    const gameResult = document.getElementById('game-result');
    const finalScoreElement = document.getElementById('final-score');
    const xpEarnedElement = document.getElementById('xp-earned');
    
    // Get all game cards
    const gameCards = document.querySelectorAll('.game-card');
    
    // Add click event to all game cards
    gameCards.forEach(card => {
      const playButton = card.querySelector('.btn-play');
      playButton.addEventListener('click', () => {
        const gameType = card.getAttribute('data-game');
        startGame(gameType);
      });
    });
    
    // Get control buttons
    const closeGameBtn = document.getElementById('close-game');
    const playAgainBtn = document.getElementById('play-again');
    const returnHubBtn = document.getElementById('return-hub');
    
    // Add event listeners to control buttons
    closeGameBtn.addEventListener('click', exitGame);
    playAgainBtn.addEventListener('click', () => {
      gameResult.classList.remove('active');
      startGame(currentGame);
    });
    returnHubBtn.addEventListener('click', () => {
      gameResult.classList.remove('active');
      exitGame();
    });
    
    // Function to start a game
    function startGame(gameType) {
      // Reset game state
      currentGame = gameType;
      currentScore = 0;
      updateScore(0);
      
      // Show game container
      gameContainer.classList.add('active');
      
      // Set game title
      switch(gameType) {
        case 'word-match':
          currentGameTitle.textContent = 'Word Match';
          break;
        case 'fill-blanks':
          currentGameTitle.textContent = 'Fill in the Blanks';
          break;
        case 'time-challenge':
          currentGameTitle.textContent = 'Time Challenge';
          break;
        case 'quick-quiz':
          currentGameTitle.textContent = 'Quick Quiz';
          break;
          case 'advanced-word-match':
    currentGameTitle.textContent = 'Advanced Word Match';
    break;
  case 'memory-game':
    currentGameTitle.textContent = 'Memory Game';
    break;
      }
      
      // Load game content
      loadGameContent(gameType);
      
      // Start timer for timed games
      if (gameType === 'time-challenge') {
        timerDisplay.style.display = 'block';
        startTimer();
      } else {
        timerDisplay.style.display = 'none';
        stopTimer();
      }
    }
    
    // Function to load game content
    function loadGameContent(gameType) {
      // Clear previous game content
      gameArea.innerHTML = '';
      
      // Get template content
      const template = document.getElementById(`${gameType}-template`);
      if (template) {
        const gameContent = template.content.cloneNode(true);
        gameArea.appendChild(gameContent);
        
        // Initialize specific game
        switch(gameType) {
          case 'word-match':
            initWordMatchGame();
            break;
          case 'fill-blanks':
            initFillBlanksGame();
            break;
          case 'time-challenge':
            initTimeChallengeGame();
            break;
          case 'quick-quiz':
            initQuickQuizGame();
            break;
            case 'advanced-word-match':
    initAdvancedWordMatchGame();
    break;
  case 'memory-game':
    initMemoryGame();
    break;
        }
      }
    }
    
    // Word Match Game
    function initWordMatchGame() {
        const wordItems = document.querySelectorAll('.word-item');
        const dropZones = document.querySelectorAll('.drop-zone');
        const checkButton = document.getElementById('check-matches');
        const resetButton = document.getElementById('reset-game');
      
        // Desktop drag-and-drop
        wordItems.forEach(item => {
          item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.getAttribute('data-word'));
            setTimeout(() => item.classList.add('dragging'), 0);
          });
          item.addEventListener('dragend', () => item.classList.remove('dragging'));
        });
      
        dropZones.forEach(zone => {
          zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('active');
          });
          zone.addEventListener('dragleave', () => zone.classList.remove('active'));
          zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('active');
            const wordData = e.dataTransfer.getData('text/plain');
            const draggedItem = document.querySelector(`.word-item[data-word="${wordData}"]`);
            if (draggedItem) {
              zone.textContent = draggedItem.textContent;
              zone.setAttribute('data-filled', wordData);
              draggedItem.classList.add('matched');
            }
          });
        });
      
        // Touch support
        let touchItem = null;
        let ghostElement = null;
      
        wordItems.forEach(item => {
          item.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchItem = item;
            item.classList.add('dragging');
      
            ghostElement = item.cloneNode(true);
            ghostElement.style.position = 'fixed';
            ghostElement.style.pointerEvents = 'none';
            ghostElement.style.opacity = '0.8';
            ghostElement.style.zIndex = '9999';
            ghostElement.style.transform = 'scale(1.1)';
            ghostElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            document.body.appendChild(ghostElement);
      
            moveGhost(e.touches[0]);
          }, { passive: false });
      
          item.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            moveGhost(touch);
      
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            dropZones.forEach(zone => zone.classList.remove('active'));
            if (target && target.classList.contains('drop-zone')) {
              target.classList.add('active');
            }
          }, { passive: false });
      
          item.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      
            if (dropTarget && dropTarget.classList.contains('drop-zone')) {
              const word = touchItem.getAttribute('data-word');
              dropTarget.textContent = touchItem.textContent;
              dropTarget.setAttribute('data-filled', word);
              touchItem.classList.add('matched');
              dropTarget.classList.remove('active');
            }
      
            if (ghostElement) ghostElement.remove();
            ghostElement = null;
      
            touchItem.classList.remove('dragging');
            touchItem = null;
          }, { passive: false });
        });
      
        function moveGhost(touch) {
          if (ghostElement) {
            ghostElement.style.top = `${touch.clientY - 20}px`;
            ghostElement.style.left = `${touch.clientX - 60}px`;
          }
        }
      
        if (checkButton) {
          checkButton.addEventListener('click', () => {
            let correctMatches = 0;
            dropZones.forEach(zone => {
              const filledWord = zone.getAttribute('data-filled');
              const correctWord = zone.parentElement.getAttribute('data-word');
              if (filledWord) {
                if (filledWord === correctWord) {
                  zone.classList.add('correct');
                  correctMatches++;
                } else {
                  zone.classList.add('incorrect');
                }
              }
            });
            updateScore(correctMatches);
            if (document.querySelectorAll('.drop-zone[data-filled]').length === dropZones.length) {
              setTimeout(() => endGame(), 1500);
            }
          });
        }
      
        if (resetButton) {
          resetButton.addEventListener('click', () => {
            dropZones.forEach(zone => {
              zone.textContent = '';
              zone.removeAttribute('data-filled');
              zone.classList.remove('correct', 'incorrect', 'active');
            });
            wordItems.forEach(item => item.classList.remove('matched', 'dragging'));
            updateScore(0);
          });
        }
    }
      
    
    // Fill in the Blanks Game
function initFillBlanksGame() {
    const bankWords = document.querySelectorAll('.bank-word');
    const blankSpaces = document.querySelectorAll('.blank-space');
    const checkButton = document.getElementById('check-blanks');
    const resetButton = document.getElementById('reset-blanks');
  
    // Desktop drag and drop
    bankWords.forEach(word => {
      word.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', word.getAttribute('data-word'));
        setTimeout(() => word.classList.add('dragging'), 0);
      });
      word.addEventListener('dragend', () => word.classList.remove('dragging'));
    });
  
    blankSpaces.forEach(blank => {
      blank.addEventListener('dragover', (e) => {
        e.preventDefault();
        blank.classList.add('active');
      });
      blank.addEventListener('dragleave', () => blank.classList.remove('active'));
      blank.addEventListener('drop', (e) => {
        e.preventDefault();
        blank.classList.remove('active');
        const wordData = e.dataTransfer.getData('text/plain');
        const draggedWord = document.querySelector(`.bank-word[data-word="${wordData}"]`);
        if (draggedWord) {
          blank.textContent = draggedWord.textContent;
          blank.setAttribute('data-filled', wordData);
          blank.classList.add('filled');
          draggedWord.classList.add('used');
        }
      });
    });
  
    // Touch support
    let touchItem = null;
    let ghostElement = null;
  
    bankWords.forEach(word => {
      word.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchItem = word;
        word.classList.add('dragging');
  
        ghostElement = word.cloneNode(true);
        ghostElement.style.position = 'fixed';
        ghostElement.style.pointerEvents = 'none';
        ghostElement.style.opacity = '0.8';
        ghostElement.style.zIndex = '9999';
        ghostElement.style.transform = 'scale(1.1)';
        ghostElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        document.body.appendChild(ghostElement);
  
        moveGhost(e.touches[0]);
      }, { passive: false });
  
      word.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        moveGhost(touch);
  
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        blankSpaces.forEach(blank => blank.classList.remove('active'));
        if (target && target.classList.contains('blank-space')) {
          target.classList.add('active');
        }
      }, { passive: false });
  
      word.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
  
        if (dropTarget && dropTarget.classList.contains('blank-space')) {
          const word = touchItem.getAttribute('data-word');
          dropTarget.textContent = touchItem.textContent;
          dropTarget.setAttribute('data-filled', word);
          dropTarget.classList.add('filled');
          touchItem.classList.add('used');
          dropTarget.classList.remove('active');
        }
  
        if (ghostElement) ghostElement.remove();
        ghostElement = null;
  
        touchItem.classList.remove('dragging');
        touchItem = null;
      }, { passive: false });
    });
  
    function moveGhost(touch) {
      if (ghostElement) {
        ghostElement.style.top = `${touch.clientY - 20}px`;
        ghostElement.style.left = `${touch.clientX - 60}px`;
      }
    }
  
    // Check blanks button
    if (checkButton) {
      checkButton.addEventListener('click', () => {
        let correctAnswers = 0;
        blankSpaces.forEach(blank => {
          const filledWord = blank.getAttribute('data-filled');
          const correctWord = blank.getAttribute('data-answer');
          if (filledWord) {
            if (filledWord === correctWord) {
              blank.classList.add('correct');
              correctAnswers++;
            } else {
              blank.classList.add('incorrect');
            }
          }
        });
        updateScore(correctAnswers);
        if (document.querySelectorAll('.blank-space[data-filled]').length === blankSpaces.length) {
          setTimeout(() => endGame(), 1500);
        }
      });
    }
  
    // Reset game button
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        blankSpaces.forEach(blank => {
          blank.textContent = '';
          blank.removeAttribute('data-filled');
          blank.classList.remove('filled', 'correct', 'incorrect', 'active');
        });
        bankWords.forEach(word => word.classList.remove('used', 'dragging'));
        updateScore(0);
      });
    }
  }
    
    // Time Challenge Game
    function initTimeChallengeGame() {
      const wordToTranslate = document.getElementById('word-to-translate');
      const translationInput = document.getElementById('translation-input');
      const submitButton = document.getElementById('submit-translation');
      const resultDisplay = document.getElementById('translation-result');
      
      // Reset timer
      timerValue = 60;
      timerValueElement.textContent = timerValue;
      
      // Word pairs for translation (Maltese to English)
      const wordPairs = [
        { maltese: 'bonġu', english: 'good morning' },
        { maltese: 'ħobż', english: 'bread' },
        { maltese: 'ilma', english: 'water' },
        { maltese: 'grazzi', english: 'thank you' },
        { maltese: 'iva', english: 'yes' },
        { maltese: 'le', english: 'no' },
        { maltese: 'jien', english: 'me' },
        { maltese: 'kif inti', english: 'how are you' }
      ];
      
      let currentPairIndex = 0;
      
      // Function to load next word
      function loadNextWord() {
        if (currentPairIndex < wordPairs.length) {
          wordToTranslate.textContent = wordPairs[currentPairIndex].maltese;
          translationInput.value = '';
          resultDisplay.textContent = '';
          resultDisplay.className = 'translation-result';
        } else {
          // End game if all words completed
          endGame();
        }
      }
      
      // Load first word
      loadNextWord();
      
      // Submit translation
      submitButton.addEventListener('click', checkTranslation);
      translationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          checkTranslation();
        }
      });
      
      function checkTranslation() {
        const userAnswer = translationInput.value.trim().toLowerCase();
        const correctAnswer = wordPairs[currentPairIndex].english;
        
        if (userAnswer === correctAnswer) {
          resultDisplay.textContent = 'Correct!';
          resultDisplay.className = 'translation-result correct';
          updateScore(currentScore + 1);
        } else {
          resultDisplay.textContent = `Incorrect. The answer is: ${correctAnswer}`;
          resultDisplay.className = 'translation-result incorrect';
        }
        
        // Move to next word after a short delay
        setTimeout(() => {
          currentPairIndex++;
          loadNextWord();
        }, 1500);
      }
    }
    
    // Quick Quiz Game
    function initQuickQuizGame() {
      const quizWord = document.getElementById('quiz-word');
      const optionButtons = document.querySelectorAll('.option-btn');
      const quizResult = document.getElementById('quiz-result');
      
      // Quiz questions (Maltese words and options)
      const quizQuestions = [
        {
          word: 'bonġu',
          options: ['good morning', 'goodbye', 'good night', 'hello'],
          correctIndex: 0
        },
        {
          word: 'ħobż',
          options: ['meat', 'bread', 'cheese', 'fish'],
          correctIndex: 1
        },
        {
          word: 'kelb',
          options: ['cat', 'bird', 'dog', 'fish'],
          correctIndex: 2
        },
        {
          word: 'karozza',
          options: ['house', 'car', 'boat', 'bicycle'],
          correctIndex: 1
        },
        {
          word: 'ilma',
          options: ['fire', 'earth', 'air', 'water'],
          correctIndex: 3
        }
      ];
      
      let currentQuestionIndex = 0;
      
      // Function to load next question
      function loadNextQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
          const currentQuestion = quizQuestions[currentQuestionIndex];
          
          // Set the word to translate
          quizWord.textContent = currentQuestion.word;
          
          // Set the options
          optionButtons.forEach((button, index) => {
            button.textContent = currentQuestion.options[index];
            button.className = 'option-btn';
            button.setAttribute('data-correct', index === currentQuestion.correctIndex);
          });
          
          // Clear result
          quizResult.textContent = '';
          quizResult.className = 'quiz-result';
        } else {
          // End game if all questions answered
          endGame();
        }
      }
      
      // Load first question
      loadNextQuestion();
      
      // Add click event to option buttons
      optionButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Disable all buttons to prevent multiple answers
          optionButtons.forEach(btn => {
            btn.disabled = true;
          });
          
          // Check if answer is correct
          const isCorrect = button.getAttribute('data-correct') === 'true';
          
          if (isCorrect) {
            button.classList.add('correct');
            quizResult.textContent = 'Correct!';
            quizResult.classList.add('correct');
            updateScore(currentScore + 1);
          } else {
            button.classList.add('incorrect');
            // Highlight the correct answer
            optionButtons.forEach(btn => {
              if (btn.getAttribute('data-correct') === 'true') {
                btn.classList.add('correct');
              }
            });
            quizResult.textContent = 'Incorrect!';
            quizResult.classList.add('incorrect');
          }
          
          // Move to next question after a short delay
          setTimeout(() => {
            currentQuestionIndex++;
            optionButtons.forEach(btn => {
              btn.disabled = false;
            });
            loadNextQuestion();
          }, 1500);
        });
      });
    }

    // Advanced Word Match Game
function initAdvancedWordMatchGame() {
  const malteseSide = document.querySelectorAll('.maltese-column .match-word');
  const englishSide = document.querySelectorAll('.english-column .match-word');
  const connectionsSvg = document.getElementById('connections-svg');
  const connectionArea = document.getElementById('connection-area');
  const checkButton = document.getElementById('check-advanced-matches');
  const resetButton = document.getElementById('reset-advanced-game');
  
  let activeWord = null;
  let connections = [];
  
  // Function to draw a line between two elements
  function drawConnection(element1, element2, isCorrect) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    const containerRect = connectionArea.getBoundingClientRect();
    
    const x1 = 0;
    const y1 = rect1.top + rect1.height/2 - containerRect.top;
    
    const x2 = connectionArea.offsetWidth;
    const y2 = rect2.top + rect2.height/2 - containerRect.top;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isCorrect === undefined ? '#007bff' : (isCorrect ? '#28a745' : '#dc3545'));
    line.setAttribute('stroke-width', '3');
    
    connectionsSvg.appendChild(line);
    
    return {
      line,
      fromIndex: element1.getAttribute('data-index'),
      toIndex: element2.getAttribute('data-index')
    };
  }
  
  // Clear all connections
  function clearConnections() {
    connectionsSvg.innerHTML = '';
    connections = [];
  }
  
  // Set up word selection
  malteseSide.forEach(word => {
    word.addEventListener('click', () => {
      if (activeWord && activeWord.side === 'maltese') {
        // If we already have a Maltese word selected, deselect it
        activeWord.element.classList.remove('selected');
        if (activeWord.element === word) {
          activeWord = null;
          return;
        }
      }
      
      // Select this word
      word.classList.add('selected');
      activeWord = { element: word, side: 'maltese', index: word.getAttribute('data-index') };
      
      // If we have an English word selected, make a connection
      if (activeWord && activeWord.partner) {
        const connection = drawConnection(activeWord.element, activeWord.partner.element);
        connections.push({
          maltese: activeWord.side === 'maltese' ? activeWord.element : activeWord.partner.element,
          english: activeWord.side === 'english' ? activeWord.element : activeWord.partner.element,
          connection: connection
        });
        
        // Reset selection
        activeWord.element.classList.remove('selected');
        activeWord.partner.element.classList.remove('selected');
        activeWord = null;
      }
    });
  });
  
  englishSide.forEach(word => {
    word.addEventListener('click', () => {
      if (activeWord && activeWord.side === 'english') {
        // If we already have an English word selected, deselect it
        activeWord.element.classList.remove('selected');
        if (activeWord.element === word) {
          activeWord = null;
          return;
        }
      }
      
      // Select this word
      word.classList.add('selected');
      
      // If we have a Maltese word selected, make a connection
      if (activeWord && activeWord.side === 'maltese') {
        const maltese = activeWord.element;
        const english = word;
        
        // Create a connection
        const connection = drawConnection(maltese, english);
        connections.push({
          maltese: maltese,
          english: english,
          connection: connection
        });
        
        // Reset selection
        maltese.classList.remove('selected');
        english.classList.remove('selected');
        activeWord = null;
      } else {
        // Otherwise, set this as the active word
        activeWord = { element: word, side: 'english', index: word.getAttribute('data-index') };
      }
    });
  });
  
  // Check answers button
  if (checkButton) {
    checkButton.addEventListener('click', () => {
      let correctMatches = 0;
      
      // Remove old lines
      connectionsSvg.innerHTML = '';
      
      // Check each connection
      connections.forEach(conn => {
        const maltese = conn.maltese;
        const english = conn.english;
        
        const maltIndex = maltese.getAttribute('data-index');
        const engIndex = english.getAttribute('data-index');
        
        const isCorrect = maltIndex === engIndex;
        
        // Redraw the connection with appropriate color
        drawConnection(maltese, english, isCorrect);
        
        if (isCorrect) {
          correctMatches++;
        }
      });
      
      // Update score
      updateScore(correctMatches);
      
      // End game if all words have connections
      if (connections.length === malteseSide.length) {
        setTimeout(() => {
          endGame();
        }, 1500);
      }
    });
  }
  
  // Reset game button
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      clearConnections();
      
      // Reset all words
      malteseSide.forEach(word => {
        word.classList.remove('selected');
      });
      
      englishSide.forEach(word => {
        word.classList.remove('selected');
      });
      
      // Reset active word
      activeWord = null;
      
      // Reset score
      updateScore(0);
    });
  }
  
  // Handle window resize to redraw connections
  window.addEventListener('resize', () => {
    if (connections.length > 0) {
      const oldConnections = [...connections];
      clearConnections();
      
      oldConnections.forEach(conn => {
        const connection = drawConnection(conn.maltese, conn.english);
        connections.push({
          maltese: conn.maltese,
          english: conn.english,
          connection: connection
        });
      });
    }
  });
}

// Memory Game
function initMemoryGame() {
  const memoryBoard = document.querySelector('.memory-board');
  const moveCountDisplay = document.getElementById('move-count');
  const pairsFoundDisplay = document.getElementById('pairs-found');
  const restartButton = document.getElementById('restart-memory');
  
  let moves = 0;
  let pairsFound = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  
  // Word pairs for the memory game (Maltese and English)
  const wordPairs = [
    { maltese: 'kelb', english: 'dog' },
    { maltese: 'qattus', english: 'cat' },
    { maltese: 'għasfur', english: 'bird' },
    { maltese: 'ħuta', english: 'fish' },
    { maltese: 'wieħed', english: 'one' },
    { maltese: 'tnejn', english: 'two' },
    { maltese: 'tlieta', english: 'three' },
    { maltese: 'erbgħa', english: 'four' }
  ];
  
  // Create cards for the game
  function createCards() {
    // Clear the board
    memoryBoard.innerHTML = '';
    
    // Create an array with all cards (Maltese and English for each pair)
    const cards = [];
    wordPairs.forEach((pair, index) => {
      cards.push({
        word: pair.maltese,
        language: 'maltese',
        pairIndex: index
      });
      cards.push({
        word: pair.english,
        language: 'english',
        pairIndex: index
      });
    });
    
    // Shuffle the cards
    const shuffledCards = shuffleArray([...cards]);
    
    // Create the board
    shuffledCards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('memory-card');
      cardElement.setAttribute('data-index', index);
      cardElement.setAttribute('data-pair', card.pairIndex);
      cardElement.setAttribute('data-language', card.language);
      
      const cardFront = document.createElement('div');
      cardFront.classList.add('card-front');
      cardFront.textContent = '?';
      
      const cardBack = document.createElement('div');
      cardBack.classList.add('card-back');
      cardBack.textContent = card.word;
      
      cardElement.appendChild(cardFront);
      cardElement.appendChild(cardBack);
      
      // Add click event
      cardElement.addEventListener('click', flipCard);
      
      memoryBoard.appendChild(cardElement);
    });
  }
  
  // Shuffle array (Fisher-Yates algorithm)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Flip card function
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    this.classList.add('flipped');
    
    if (!firstCard) {
      // First card flipped
      firstCard = this;
      return;
    }
    
    // Second card flipped
    secondCard = this;
    checkForMatch();
  }
  
  // Check if the two flipped cards match
  function checkForMatch() {
    // Increment move counter
    moves++;
    moveCountDisplay.textContent = moves;
    
    const isPair = firstCard.getAttribute('data-pair') === secondCard.getAttribute('data-pair');
    const isDifferentLanguage = firstCard.getAttribute('data-language') !== secondCard.getAttribute('data-language');
    
    // Only match if the pair index is the same AND one is Maltese and one is English
    if (isPair && isDifferentLanguage) {
      // Cards match
      disableCards();
      pairsFound++;
      pairsFoundDisplay.textContent = pairsFound;
      
      // Check if all pairs are found
      if (pairsFound === wordPairs.length) {
        setTimeout(() => {
          endGame();
        }, 1000);
      }
    } else {
      // Cards don't match
      unflipCards();
    }
  }
  
  // Disable matched cards
  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    resetBoard();
  }
  
  // Unflip unmatched cards
  function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      
      resetBoard();
    }, 1000);
  }
  
  // Reset board for next selection
  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }
  
  // Reset game function
  function resetGame() {
    moves = 0;
    pairsFound = 0;
    moveCountDisplay.textContent = moves;
    pairsFoundDisplay.textContent = pairsFound;
    
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    
    createCards();
  }
  
  // Initialize game
  resetGame();
  
  // Restart button event
  if (restartButton) {
    restartButton.addEventListener('click', resetGame);
  }
}
    
    // Timer functions
    function startTimer() {
      timerValue = 60;
      timerValueElement.textContent = timerValue;
      
      clearInterval(gameTimer);
      gameTimer = setInterval(() => {
        timerValue--;
        timerValueElement.textContent = timerValue;
        
        if (timerValue <= 0) {
          stopTimer();
          endGame();
        }
      }, 1000);
    }
    
    function stopTimer() {
      clearInterval(gameTimer);
    }
    
    // Update score display
    function updateScore(newScore) {
      currentScore = newScore;
      scoreDisplay.textContent = currentScore;
    }
    
    // End game and show results
    function endGame() {
      stopTimer();
      
      // Calculate XP earned based on score and game type
      const baseXP = xpValues[currentGame] || 10;
      const earnedXP = Math.max(5, Math.round(currentScore * baseXP));
      
      // Update result screen
      finalScoreElement.textContent = currentScore;
      xpEarnedElement.textContent = earnedXP;
      
      // Show result screen
      gameResult.classList.add('active');
      
      // Add to user's total XP (in a real app, this would connect to user account)
      console.log(`Game completed: ${currentScore} points, ${earnedXP} XP earned`);
      
      // Update daily challenge progress (in a real app)
      updateChallengeProgress();
    }
    
    // Exit game without showing results
    function exitGame() {
      stopTimer();
      gameContainer.classList.remove('active');
      currentGame = null;
    }
    
    // Update daily challenge progress
    function updateChallengeProgress() {
      // In a real app, this would track which games the user has played today
      // and update the UI accordingly
      const progressElement = document.querySelector('.challenge-progress .completed');
      if (progressElement) {
        const currentCompleted = parseInt(progressElement.textContent, 10);
        const newCompleted = Math.min(currentCompleted + 1, 3);
        progressElement.textContent = newCompleted;
        
        if (newCompleted === 3) {
          // Daily challenge completed! Award bonus XP
          console.log('Daily challenge completed! +50 bonus XP');
          // In a real app, add this to user's account
        }
      }
    }
  });