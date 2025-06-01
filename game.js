document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and game is starting!");

  // Title Screen Music
  // Help: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
  const titleScreen = document.getElementById("title-screen");
  if (titleScreen) {
    console.log("Title screen detected. Preparing background music...");
    const titleMusic = new Audio("music/titlescreen.mp3");
    titleMusic.loop = true;
    titleMusic.volume = 0.5;

    titleMusic.play().catch(() => {
      console.log("Autoplay blocked. Waiting for user interaction to play music.");
      document.body.addEventListener("click", () => titleMusic.play(), { once: true });
    });
  }

  // Screen switching
  // ChatGPT-4o prompt: I have three screens that I want to show in the same HTML file,
  // can you please transition the ids go like this: title-screen -> intro-screen -> choose screen.
  // In the title screen there is a start button to go to the next site,
  // then a next button and then in the choosing screen you can choose your yurei.
  function switchScreen(hideId, showId) {
    console.log(`Switching screen from ${hideId} to ${showId}`);
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);

    if (hideEl && showEl) {
      hideEl.classList.remove("active");
      hideEl.classList.add("hidden");
      showEl.classList.remove("hidden");
      showEl.classList.add("active");
    } else {
      console.warn("One of the screens could not be found.");
    }
  }

  document.getElementById("start-btn")?.addEventListener("click", () => {
    console.log("Start button clicked. Moving to intro screen.");
    switchScreen("title-screen", "intro-screen");
  });

  document.getElementById("go-to-select")?.addEventListener("click", () => {
    console.log("Next button clicked. Moving to character selection screen.");
    switchScreen("intro-screen", "choose-screen");
  });

  // Gameplay 
  const yurei = document.getElementById("yurei");
  const fill = document.getElementById("happiness-fill");
  const gameOverScreen = document.getElementById("game-over-screen");

  if (yurei && fill) {
    console.log("Gameplay screen detected. Setting up Yurei...");
    let happiness = 100;
    const maxHappiness = 100;
    const happinessStep = 10;
    const happyDuration = 1000;

    const interactionSound = new Audio("music/happysound.mp3");
    const happyStateMusic = new Audio("music/regularyurei.mp3");
    const neutralStateMusic = new Audio("music/annoyedyurei.mp3");
    const sadStateMusic = new Audio("music/decayingyurei.mp3");
    const deathSound = new Audio("music/gameover2.mp3");

    // ChatGPT-4o prompt:
    // Can you please match the music/happysound.mp3, regularyurei.mp3, annoyedyurei.mp3,
    // decayingyurei.mp3 and gameover2.mp3 match with yurei's state?
    [happyStateMusic, neutralStateMusic, sadStateMusic].forEach(track => track.loop = true);

    let currentState = "";
    let currentMusic = null;

    // Sprite/music switch based on happiness
    // Help: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
    function updateYureiSprite() {
      let newState = "";

      if (happiness > 60) {
        yurei.src = "images/loveyurei.PNG";
        newState = "happy";
      } else if (happiness > 30) {
        yurei.src = "images/midloveyurei.PNG";
        newState = "neutral";
      } else if (happiness > 0) {
        yurei.src = "images/sadloveyurei.PNG";
        newState = "sad";
      }

      if (newState !== currentState) {
        console.log(`Yurei state changed to: ${newState}`);

        if (currentMusic) {
          console.log("Stopping current music...");
          currentMusic.pause();
          currentMusic.currentTime = 0;
        }

        switch (newState) {
          case "happy":
            currentMusic = happyStateMusic;
            break;
          case "neutral":
            currentMusic = neutralStateMusic;
            break;
          case "sad":
            currentMusic = sadStateMusic;
            break;
        }

        currentMusic?.play().then(() => {
          console.log(`Now playing music for: ${newState} state`);
        }).catch(() => {
          console.warn("Music autoplay blocked. Waiting for user click.");
          document.body.addEventListener("click", () => currentMusic.play(), { once: true });
        });

        currentState = newState;
      }
    }

    // Progress bar
    function updateBar() {
      fill.style.width = `${happiness}%`;
      console.log(`Happiness bar updated to ${happiness}%`);
    }

    function makeYureiHappy() {
      yurei.src = "images/happyloveyurei.PNG";
      console.log("Yurei is feeling extra happy now!");
      setTimeout(updateYureiSprite, happyDuration);
    }

    function boostHappiness() {
      if (happiness < maxHappiness) {
        console.log("Happiness increased.");
        happiness = Math.min(happiness + happinessStep, maxHappiness);
        updateBar();
        makeYureiHappy();
        interactionSound.currentTime = 0;
        interactionSound.play();
      } else {
        console.log("Happiness is already at maximum.");
      }
    }

    // Button event listeners
    document.getElementById("btn-food")?.addEventListener("click", () => {
      console.log("Food button clicked.");
      boostHappiness();
    });

    document.getElementById("btn-medicine")?.addEventListener("click", () => {
      console.log("Medicine button clicked.");
      boostHappiness();
    });

    document.getElementById("btn-cleanse")?.addEventListener("click", () => {
      console.log("Cleanse button clicked.");
      boostHappiness();
    });

    // Happiness decay over time
    // Help: https://developer.mozilla.org/en-US/docs/Web/API/setInterval
    setInterval(() => {
      happiness = Math.max(0, happiness - 10);
      console.log("Passive decay triggered. Happiness decreased by 10.");
      updateYureiSprite();
      updateBar();

      if (happiness === 0 && gameOverScreen) {
        console.warn("Yurei has faded away. Game Over triggered.");
        gameOverScreen.classList.remove("hidden");
        deathSound.play();
        currentMusic?.pause();
      }
    }, 6000);

    updateYureiSprite();
    updateBar();
  }

  // Minigame Button Redirect
  const minigameBtn = document.getElementById("minigame-btn");
  if (minigameBtn) {
    const clickSound = new Audio("music/startupminigame.mp3");

    minigameBtn.addEventListener("click", () => {
      console.log("Minigame button clicked. Playing sound and redirecting...");
      clickSound.play();
      setTimeout(() => {
        console.log("Redirecting to minigame.html");
        window.location.href = "minigame.html";
      }, 870); 
    });
  }
});
