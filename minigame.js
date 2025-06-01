// === Audio Setup ===
// Help: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement

const minigameMusic = new Audio("music/minigamemusic.mp3");
minigameMusic.loop = true;
minigameMusic.volume = 0.5;

console.log("Initializing background music...");

minigameMusic.play().then(() => {
  console.log("Minigame music started automatically.");
}).catch(() => {
  console.log("User interaction required to start music.");
  document.body.addEventListener("click", () => {
    minigameMusic.play();
    console.log("Music started after user interaction.");
  }, { once: true });
});

// Victory sound effect
const victorySound = new Audio("music/victoryidkman.mp3");
victorySound.volume = 1;
console.log("Victory sound loaded.");

// === DOM Element References ===
const problemElement = document.getElementById("problem");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const feedback = document.getElementById("feedback");
const timerDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");

console.log("DOM elements loaded and ready.");

// === Game State Variables ===
let currentAnswer = 0;
let timeLeft = 40;
let score = 0;
let problemsAnswered = 0;
const maxProblems = 9;

// === Generate a New Math Problem ===
// ChatGPT-4o Prompt: Can you make a random math problem generator using +, -, × and ÷ with answers included?
// Xtra help: https://youtu.be/UZqSpuUJPa0?si=fWbIRQXbbgzuuQhE

function generateProblem() {
  if (problemsAnswered >= maxProblems || timeLeft <= 0) {
    console.log("Max problems reached or time expired. Triggering win state.");
    triggerVictory();
    return;
  }

  const a = Math.floor(Math.random() * 10 + 1);
  const b = Math.floor(Math.random() * 9 + 1);
  const operators = ["+", "-", "×", "÷"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let displayProblem = `${a} ${operator} ${b}`;

  switch (operator) {
    case "+":
      currentAnswer = a + b;
      break;
    case "-":
      currentAnswer = a - b;
      break;
    case "×":
      currentAnswer = a * b;
      break;
    case "÷":
      displayProblem = `${a * b} ÷ ${b}`; 
      currentAnswer = a;
      break;
  }

  console.log(`New problem generated: ${displayProblem} (Answer: ${currentAnswer})`);

  problemElement.textContent = displayProblem;
  answerInput.value = "";
  feedback.textContent = "";
  problemsAnswered++;
}

// === Start Countdown Timer ===
// ChatGPT Prompt: Can you make a countdown timer that disables input when time is up?

function startTimer() {
  console.log("Starting timer...");

  const timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      feedback.textContent = "Time's up!";
      submitBtn.disabled = true;
      answerInput.disabled = true;
      console.log("Timer ended. Game over.");
    }
  }, 1000);
}

// === Submit Answer ===
// ChatGPT Prompt: Can I check if an input number matches a correct answer with an event listener?

submitBtn.addEventListener("click", () => {
  const userAnswer = parseFloat(answerInput.value);
  console.log(`Answer submitted: ${userAnswer} | Correct: ${currentAnswer}`);

  if (userAnswer === currentAnswer) {
    score++;
    scoreDisplay.textContent = score;
    feedback.textContent = "Correct!";
    console.log(`Correct answer! Score increased to ${score}`);
    generateProblem();
  } else {
    feedback.textContent = "Try again!";
    console.log("Incorrect answer submitted.");
  }
});

// === Trigger Win State ===

function triggerVictory() {
  console.log("Victory triggered. Player has won.");
  feedback.textContent = "You won!";
  minigameMusic.pause();
  victorySound.play();
  submitBtn.disabled = true;
  answerInput.disabled = true;
}

// === Initialize Game ===

console.log("Initializing game...");
generateProblem();
startTimer();
scoreDisplay.textContent = score;

// === Submit on Enter Key ===

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    console.log("Enter key pressed. Submitting answer.");
    submitBtn.click();
  }
});
