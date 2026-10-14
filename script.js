let score = 0;
let gameDuration = 20;
let timeLeft = gameDuration;
let gameInterval = null;
let spawnerInterval = null;

// Wait for DOM to load fully before grabbing elements
document.addEventListener("DOMContentLoaded", () => {
    console.log("Arcade Script Loaded Successfully!");
});

function getElements() {
    return {
        mainMenu: document.getElementById("main-menu"),
        modeScreen: document.getElementById("mode-screen"),
        gameScreen: document.getElementById("game-screen"),
        gameCanvas: document.getElementById("game-canvas"),
        scoreDisplay: document.getElementById("score-display"),
        timerDisplay: document.getElementById("timer-display"),
        playAgainBtn: document.getElementById("play-again-btn"),
        modeSelectBtn: document.getElementById("mode-select-btn"),
        backBtn: document.getElementById("back-btn")
    };
}

function showModeSelect() {
    const el = getElements();
    clearInterval(gameInterval);
    clearInterval(spawnerInterval);

    if (el.mainMenu) el.mainMenu.classList.add("hidden");
    if (el.modeScreen) el.modeScreen.classList.remove("hidden");
    if (el.gameScreen) el.gameScreen.classList.add("hidden");
}

function startLeafGame(seconds) {
    if (seconds) {
        gameDuration = seconds;
    }

    const el = getElements();
    clearInterval(gameInterval);
    clearInterval(spawnerInterval);

    if (el.mainMenu) el.mainMenu.classList.add("hidden");
    if (el.modeScreen) el.modeScreen.classList.add("hidden");
    if (el.gameScreen) el.gameScreen.classList.remove("hidden");
    
    if (el.playAgainBtn) el.playAgainBtn.classList.add("hidden");
    if (el.modeSelectBtn) el.modeSelectBtn.classList.add("hidden");
    if (el.backBtn) el.backBtn.classList.add("hidden");

    score = 0;
    timeLeft = gameDuration;
    if (el.scoreDisplay) el.scoreDisplay.innerText = "Score: " + score;
    if (el.timerDisplay) el.timerDisplay.innerText = "Time: " + timeLeft + "s";
    
    if (el.gameCanvas) el.gameCanvas.innerHTML = "";

    gameInterval = setInterval(() => {
        timeLeft--;
        if (el.timerDisplay) el.timerDisplay.innerText = "Time: " + timeLeft + "s";
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    spawnerInterval = setInterval(spawnLeaf, 600);
}

function spawnLeaf() {
    if (timeLeft <= 0) return;

    const el = getElements();
    if (!el.gameCanvas) return;

    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    
    const leafTypes = ["🍁", "🍂", "🍃", "🌰"];
    leaf.innerText = leafTypes[Math.floor(Math.random() * leafTypes.length)];

    const maxX = el.gameCanvas.clientWidth - 40;
    const randomX = Math.floor(Math.random() * maxX);
    leaf.style.left = randomX + "px";
    leaf.style.top = "-40px";

    leaf.addEventListener("mousedown", () => {
        if (timeLeft > 0) {
            score++;
            if (el.scoreDisplay) el.scoreDisplay.innerText = "Score: " + score;
            leaf.remove();
        }
    });

    el.gameCanvas.appendChild(leaf);

    let posY = -40;
    const fallSpeed = 2 + Math.random() * 3;

    const fallInterval = setInterval(() => {
        posY += fallSpeed;
        leaf.style.top = posY + "px";

        if (posY > el.gameCanvas.clientHeight || timeLeft <= 0) {
            clearInterval(fallInterval);
            leaf.remove();
        }
    }, 30);
}

function endGame() {
    const el = getElements();
    clearInterval(gameInterval);
    clearInterval(spawnerInterval);
    
    if (el.gameCanvas) {
        el.gameCanvas.innerHTML = `
            <div style='margin-top: 80px;'>
                <h2 style='color:#f39c12; margin-bottom: 5px; font-size: 28px;'>Time's Up!</h2>
                <p style='color:#f4e8c1; font-size: 20px;'>Final Score: ${score}</p>
            </div>
        `;
    }

    if (el.playAgainBtn) el.playAgainBtn.classList.remove("hidden");
    if (el.modeSelectBtn) el.modeSelectBtn.classList.remove("hidden");
    if (el.backBtn) el.backBtn.classList.remove("hidden");
}

function returnToMenu() {
    const el = getElements();
    clearInterval(gameInterval);
    clearInterval(spawnerInterval);
    if (el.gameScreen) el.gameScreen.classList.add("hidden");
    if (el.modeScreen) el.modeScreen.classList.add("hidden");
    if (el.mainMenu) el.mainMenu.classList.remove("hidden");
}