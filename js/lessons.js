document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const lessonModal = document.getElementById("lesson-modal");
  const modalTitle = document.getElementById("modal-lesson-title");
  const modalContent = document.getElementById("modal-lesson-content");
  const closeBtn = document.querySelector(".close-btn");
  const viewNotesButtons = document.querySelectorAll(".view-notes");
  const downloadNotesButtons = document.querySelectorAll(".download-notes");
  const playAudioButtons = document.querySelectorAll(".play-audio");
  const audioPlayer = document.getElementById("pronunciation-player");
  const flashcards = document.querySelectorAll(".flashcard");

  // ===============================
  // Modal Functions
  // ===============================

  // Open modal with lesson content
  function openLessonModal(lessonId) {
    // Get lesson title
    const lessonCard = document.querySelector(`[data-lesson="${lessonId}"]`);
    const lessonTitle = lessonCard.querySelector("h3").textContent;

    // Set modal title
    modalTitle.textContent = lessonTitle;

    // Get lesson content from template
    const lessonTemplate = document.getElementById(`${lessonId}-content`);
    if (lessonTemplate) {
      const content = lessonTemplate.content.cloneNode(true);

      // Clear previous content and add new content
      modalContent.innerHTML = "";
      modalContent.appendChild(content);

      // Show modal
      lessonModal.style.display = "block";
    } else {
      console.error(`Template for lesson ${lessonId} not found`);
    }
  }

  // Close modal
  function closeModal() {
    lessonModal.style.display = "none";
  }

  // Pronunciation input button
  const pronounceButton = document.getElementById("pronounce-button");
  if (pronounceButton) {
    pronounceButton.addEventListener("click", function () {
      const wordInput = document.getElementById("pronounce-word");
      if (wordInput && wordInput.value.trim() !== "") {
        const word = wordInput.value.trim();
        console.log("Pronouncing:", word);
        playAudio(word); // reuse your existing playAudio() to simulate
      }
    });
  }

  // Close modal when clicking outside of modal content
  window.addEventListener("click", function (event) {
    if (event.target === lessonModal) {
      closeModal();
    }
  });

  // Add event listeners to View Notes buttons
  viewNotesButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lessonId = this.getAttribute("data-lesson");
      openLessonModal(lessonId);
    });
  });

  // Add event listener to close button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // ===============================
  // Download Notes Functions
  // ===============================

  // Download lesson notes
  function downloadNotes(lessonId) {
    // Get lesson title
    const lessonCard = document.querySelector(`[data-lesson="${lessonId}"]`);
    const lessonTitle = lessonCard.querySelector("h3").textContent;

    // Get lesson content from template
    const lessonTemplate = document.getElementById(`${lessonId}-content`);

    if (lessonTemplate) {
      // Clone the content
      const contentClone = lessonTemplate.content.cloneNode(true);

      // Create a temporary div to hold the content
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(contentClone);

      // Extract text content
      const textContent = tempDiv.textContent.trim();

      // Create a Blob with the text content
      const blob = new Blob([`${lessonTitle}\n\n${textContent}`], {
        type: "text/plain",
      });

      // Create a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${lessonId}-notes.txt`;

      // Trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error(`Template for lesson ${lessonId} not found`);
    }
  }

  // Add event listeners to Download Notes buttons
  downloadNotesButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lessonId = this.getAttribute("data-lesson");
      downloadNotes(lessonId);
    });
  });

  // ===============================
  // Audio Playback Functions
  // ===============================

  // Play pronunciation audio
  function playAudio(audioFile) {
    const audioPath = `assets/audio/${audioFile}`;

    // Set the audio source
    audioPlayer.src = audioPath;

    // Play the audio
    audioPlayer.play().catch((error) => {
      console.error("Error playing audio:", error);
      alert("Could not play audio. Please make sure the audio file exists.");
    });
  }

  // Add event listeners to audio buttons
  playAudioButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const audioFile = this.getAttribute("data-audio");

      // Visual feedback when clicked
      this.classList.add("playing");

      // Remove the class after animation completes
      setTimeout(() => {
        this.classList.remove("playing");
      }, 500);

      playAudio(audioFile);
    });
  });

  // ===============================
  // Flashcard Functions
  // ===============================

  // Toggle flashcard flip
  function toggleFlashcard(flashcard) {
    flashcard.classList.toggle("flipped");
  }

  // Add event listeners to flashcards
  flashcards.forEach((flashcard) => {
    flashcard.addEventListener("click", function () {
      toggleFlashcard(this);
    });
  });

  // Shuffle Practice
  const flashcardsContainer = document.getElementById("flashcards-container");
  const shuffleButton = document.getElementById("shuffle-flashcards");
  let wordsList = [];

  fetch("data/words.json")
    .then((response) => response.json())
    .then((data) => {
      wordsList = data;
      generateFlashcards();
    })
    .catch((error) => {
      console.error("Failed to load flashcards", error);
    });

  function generateFlashcards() {
    flashcardsContainer.innerHTML = ""; // clear old flashcards

    const shuffled = [...wordsList].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 4);

    selectedWords.forEach((word) => {
      const flashcard = document.createElement("div");
      flashcard.className = "flashcard";
      flashcard.innerHTML = `
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <h3>${word.maltese}</h3>
          </div>
          <div class="flashcard-back">
            <h3>${word.english}</h3>
          </div>
        </div>
      `;
      flashcardsContainer.appendChild(flashcard);
    });

    // Attach flip effect
    flashcardsContainer.querySelectorAll(".flashcard").forEach((card) => {
      card.addEventListener("click", function () {
        this.classList.toggle("flipped");
      });
    });
  }

  shuffleButton.addEventListener("click", function () {
    generateFlashcards();
  });

  const categoryTabs = document.querySelectorAll(".category-tab");
  const categoryContents = document.querySelectorAll(".category-content");

  // Add category switching functionality
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      categoryTabs.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked tab
      tab.classList.add("active");

      // Hide all category contents
      categoryContents.forEach((content) => {
        content.classList.remove("active");
      });

      // Show the corresponding category content
      const categoryId = tab.getAttribute("data-category");
      const targetContent = document.getElementById(`${categoryId}-content`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // Set default active category
  const defaultCategory = categoryTabs[0];
  if (defaultCategory) {
    defaultCategory.click();
  }
});
