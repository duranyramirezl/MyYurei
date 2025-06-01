// Unfortunately I tried several times to put the Water yurei states in 
// the same file as game.js, but i had a lot of issues with that so 
// I made a clone of game.js for water yurei and also a separate html file
document.addEventListener("DOMContentLoaded", () => {
  // --- Water Yurei Gameplay ---
  const yurei = document.getElementById("yurei");
  const fill = document.getElementById("happiness-fill");
  const gameOverScreen = document.getElementById("game-over-screen");

  if (yurei && fill) {
    let happiness = 100;
    const maxHappiness = 100;
    const happinessStep = 10;
    const happyDuration = 1000;

    const interactionSound = new Audio("music/happysound.mp3");
    const happyStateMusic = new Audio("music/regularyurei.mp3");
    const neutralStateMusic = new Audio("music/annoyedyurei.mp3");
    const sadStateMusic = new Audio("music/decayingyurei.mp3");
    const deathSound = new Audio("music/gameover2.mp3");

    [happyStateMusic, neutralStateMusic, sadStateMusic].forEach(track => track.loop = true);

    let currentState = "";
    let currentMusic = null;

    function updateYureiSprite() {
      let newState = "";

      if (happiness > 60) {
        yurei.src = "images/wateryurei.PNG";
        newState = "happy";
      } else if (happiness > 30) {
        yurei.src = "images/midwateryurei.PNG";
        newState = "neutral";
      } else if (happiness > 0) {
        yurei.src = "images/sadwateryurei.PNG";
        newState = "sad";
      }

      if (newState !== currentState) {
        if (currentMusic) {
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

        currentMusic?.play();
        currentState = newState;
      }
    }

    function updateBar() {
      fill.style.width = `${happiness}%`;
    }

    function makeYureiHappy() {
      yurei.src = "images/happywateryurei.PNG";
      setTimeout(updateYureiSprite, happyDuration);
    }

    function boostHappiness() {
      happiness = Math.min(happiness + happinessStep, maxHappiness);
      updateBar();
      makeYureiHappy();
      interactionSound.currentTime = 0;
      interactionSound.play();
    }

    document.getElementById("btn-food")?.addEventListener("click", boostHappiness);
    document.getElementById("btn-medicine")?.addEventListener("click", boostHappiness);
    document.getElementById("btn-cleanse")?.addEventListener("click", boostHappiness);

    setInterval(() => {
      happiness = Math.max(0, happiness - 10);
      updateYureiSprite();
      updateBar();

      if (happiness === 0 && gameOverScreen) {
        gameOverScreen.classList.remove("hidden");
        deathSound.play();
        currentMusic?.pause();
      }
    }, 6000);

    updateYureiSprite();
    updateBar();
  }

  // --- Minigame Button ---
  const minigameBtn = document.getElementById("minigame-btn");
  if (minigameBtn) {
    const clickSound = new Audio("music/startupminigame.mp3");

    minigameBtn.addEventListener("click", () => {
      clickSound.play();
      setTimeout(() => {
        window.location.href = "minigame.html";
      }, 870);
    });
  }
});
