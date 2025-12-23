/*** Dark Mode ***

Purpose:
- Use this starter code to add a dark mode feature to your website.

When To Modify:
- [ ] Project 5 (REQUIRED FEATURE) 
- [ ] Any time after
***/

// Step 1: Select the theme button
let themeButton = document.getElementById("theme-button");

// Step 2: Dark mode callback
const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
};

// Step 3: Event listener
themeButton.addEventListener("click", toggleDarkMode);


// ===========================
// RSVP COUNT + FORM HANDLING
// ===========================

let count = 3;

/*** Form Handling [ADDED IN UNIT 6]

Purpose:
- Adds a new participant to the RSVP list and updates the count.
***/

// addParticipant now takes a *person object*
const addParticipant = (person) => {
  const participantList = document.querySelector(".rsvp-participants");

  const p = document.createElement("p");
  // Show name, year, and major nicely
  p.textContent = `🎟️ ${person.name} (${person.year}, ${person.major}) has RSVP'd.`;
  participantList.appendChild(p);

  // Update the counter
  const oldCounter = document.getElementById("rsvp-count");
  if (oldCounter) {
    oldCounter.remove();
  }

  count += 1;

  const newCounter = document.createElement("p");
  newCounter.id = "rsvp-count";
  newCounter.textContent = `⭐ ${count} people have RSVP'd to this event!`;
  participantList.appendChild(newCounter);
};

const rsvpButton = document.getElementById("rsvp-submit");


/*** Form Validation [ADDED IN UNIT 7]

Purpose:
- Prevents invalid form submissions from being added to the list of participants.
***/

const validateForm = (event) => {
  event.preventDefault();

  let containsErrors = false;

  // Grab all inputs
  const nameInput  = document.getElementById("name");
  const yearInput  = document.getElementById("year");
  const majorInput = document.getElementById("major");
  const emailInput = document.getElementById("email");

  // Build the person object
  const person = {
    name:  nameInput.value.trim(),
    year:  yearInput.value.trim(),
    major: majorInput.value.trim(),
    email: emailInput.value.trim()
  };

  // Clear old error styles
  nameInput.classList.remove("error");
  yearInput.classList.remove("error");
  majorInput.classList.remove("error");
  emailInput.classList.remove("error");

  // Validate name
  if (person.name.length < 2) {
    nameInput.classList.add("error");
    containsErrors = true;
  }

  // Validate year
  if (person.year.length < 2) {
    yearInput.classList.add("error");
    containsErrors = true;
  }

  // Validate major (this is what was missing before)
  if (person.major.length < 2) {
    majorInput.classList.add("error");
    containsErrors = true;
  }

  // Validate email
  if (person.email.length < 2 || !person.email.includes("@")) {
    emailInput.classList.add("error");
    containsErrors = true;
  }

  // If no errors → add participant + show modal
  if (!containsErrors) {
    addParticipant(person);
    toggleModal(person);

    // Clear fields
    nameInput.value  = "";
    yearInput.value  = "";
    majorInput.value = "";
    emailInput.value = "";
  }
};

// Attach validator to the button
rsvpButton.addEventListener("click", validateForm);



/*** Success Modal + Animation [UNITS 9 & STRETCH] ***/

// Animation + modal state
let rotateFactor = 0;
const modalImage = document.getElementById("modal-image");
let intervalId = null;
let modalTimeoutId = null;
let reduceMotion = false;   // Step 7 flag

// Animate image (little "wave")
const animateImage = () => {
  if (reduceMotion || !modalImage) return;

  if (rotateFactor === 0) {
    rotateFactor = -10;
  } else {
    rotateFactor = 0;
  }

  modalImage.style.transform = `rotate(${rotateFactor}deg)`;
};

// Close the modal (used by button AND timeout)
const closeModal = () => {
  const modal = document.getElementById("success-modal");
  if (!modal) return;

  modal.style.display = "none";

  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (modalTimeoutId !== null) {
    clearTimeout(modalTimeoutId);
    modalTimeoutId = null;
  }

  rotateFactor = 0;
  if (modalImage) {
    modalImage.style.transform = "rotate(0deg)";
  }
};

// Show the modal
const toggleModal = (person) => {
  const modal     = document.getElementById("success-modal");
  const modalText = document.getElementById("modal-text");

  if (!modal) return;

  if (modalText) {
    modalText.textContent = `Thanks for RSVPing, ${person.name}! We can't wait to see you at recruitment.`;
  }

  modal.style.display = "flex";

  // Start animation only if motion is allowed and image exists
  if (!reduceMotion && modalImage) {
    intervalId = setInterval(animateImage, 500);
  }

  // Hide after 5 seconds
  modalTimeoutId = setTimeout(closeModal, 5000);
};

// Step 6: Close button wiring
const modalCloseButton = document.getElementById("modal-close");
if (modalCloseButton) {
  modalCloseButton.addEventListener("click", closeModal);
}

// Step 7: Reduce Motion button wiring
const reduceMotionButton = document.getElementById("reduce-motion-button");
if (reduceMotionButton) {
  reduceMotionButton.addEventListener("click", () => {
    reduceMotion = !reduceMotion;

    reduceMotionButton.textContent = reduceMotion
      ? "Reduce Motion ON"
      : "Reduce Motion OFF";

    // If they turn motion off while animation is running, stop it
    if (reduceMotion && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
      rotateFactor = 0;
      if (modalImage) {
        modalImage.style.transform = "rotate(0deg)";
      }
    }
  });
}