// --- LEAF CATCHER VARIABLES ---
let score = 0;
let gameDuration = 20;
let timeLeft = gameDuration;
let gameInterval = null;
let spawnerInterval = null;

// --- MEMORY MATCH VARIABLES ---
let matchedPairs = 0;
let totalPairsNeeded = 0;
let moves = 0;
let isChecking = false;
let flippedCards = [];

// --- APPLE BOBBING VARIABLES ---
let appleScore = 0;
let appleDuration = 15;
let appleTimeLeft = appleDuration;
let appleGameInterval = null;
let appleSpawnerInterval = null;

// --- NAVIGATION FUNCTIONS ---
function showLeafCatcherModes() {
    clearAllIntervals();
    safeHide("main-menu");
    safeShow("mode-screen");
    safeHide("memory-mode-screen");
    safeHide("apple-mode-screen");
    safeHide("game-screen");
    safeHide("memory-game-screen");
    safeHide("apple-game-screen");
}

function showMemoryModes() {
    clearAllIntervals();
    safeHide("main-menu");
    safeHide("mode-screen");
    safeShow("memory-mode-screen");
    safeHide("apple-mode-screen");
    safeHide("game-screen");
    safeHide("memory-game-screen");
    safeHide("apple-game-screen");
}

function showAppleBobbingModes() {
    clearAllIntervals();
    safeHide("main-menu");
    safeHide("mode-screen");
    safeHide("memory-mode-screen");
    safeShow("apple-mode-screen");
    safeHide("game-screen");
    safeHide("memory-game-screen");
    safeHide("apple-game-screen");
}

function returnToMenu() {
    clearAllIntervals();
    safeHide("game-screen");
    safeHide("mode-screen");
    safeHide("memory-mode-screen");
    safeHide("memory-game-screen");
    safeHide("apple-mode-screen");
    safeHide("apple-game-screen");
    safeHide("pumpkin-game-screen");
    safeShow("main-menu");
}

function clearAllIntervals() {
    clearInterval(gameInterval);
    clearInterval(spawnerInterval);
    clearInterval(appleGameInterval);
    clearInterval(appleSpawnerInterval);
}

// --- HELPER FUNCTIONS ---
function safeShow(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.remove("hidden");
}

function safeHide(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.classList.add("hidden");
}

// --- LEAF CATCHER LOGIC ---
function startLeafGame(seconds) {
    if (seconds) gameDuration = seconds;
    clearAllIntervals();

    safeHide("main-menu");
    safeHide("mode-screen");
    safeShow("game-screen");
    
    safeHide("play-again-btn");
    safeHide("mode-select-btn");
    safeHide("back-btn");

    score = 0;
    timeLeft = gameDuration;
    
    const scoreDisplay = document.getElementById("score-display");
    const timerDisplay = document.getElementById("timer-display");
    const gameCanvas = document.getElementById("game-canvas");

    if (scoreDisplay) scoreDisplay.innerText = "Score: " + score;
    if (timerDisplay) timerDisplay.innerText = "Time: " + timeLeft + "s";
    if (gameCanvas) gameCanvas.innerHTML = "";

    gameInterval = setInterval(() => {
        timeLeft--;
        if (timerDisplay) timerDisplay.innerText = "Time: " + timeLeft + "s";
        if (timeLeft <= 0) endLeafGame();
    }, 1000);

    spawnerInterval = setInterval(spawnLeaf, 600);
}

function spawnLeaf() {
    if (timeLeft <= 0) return;
    const gameCanvas = document.getElementById("game-canvas");
    if (!gameCanvas) return;

    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    
    const leafTypes = ["🍁", "🍂", "🍃", "🌰"];
    leaf.innerText = leafTypes[Math.floor(Math.random() * leafTypes.length)];

    const maxX = gameCanvas.clientWidth - 40;
    const randomX = Math.floor(Math.random() * maxX);
    leaf.style.left = randomX + "px";
    leaf.style.top = "-40px";

    leaf.addEventListener("mousedown", () => {
        if (timeLeft > 0) {
            score++;
            const scoreDisplay = document.getElementById("score-display");
            if (scoreDisplay) scoreDisplay.innerText = "Score: " + score;
            leaf.remove();
        }
    });

    gameCanvas.appendChild(leaf);

    let posY = -40;
    const fallSpeed = 2 + Math.random() * 3;

    const fallInterval = setInterval(() => {
        posY += fallSpeed;
        leaf.style.top = posY + "px";

        if (posY > gameCanvas.clientHeight || timeLeft <= 0) {
            clearInterval(fallInterval);
            leaf.remove();
        }
    }, 30);
}

function endLeafGame() {
    clearAllIntervals();
    
    const gameCanvas = document.getElementById("game-canvas");
    if (gameCanvas) {
        gameCanvas.innerHTML = `
            <div style='margin-top: 80px;'>
                <h2 style='color:#f39c12; margin-bottom: 5px; font-size: 28px;'>Time's Up!</h2>
                <p style='color:#f4e8c1; font-size: 20px;'>Final Score: ${score}</p>
            </div>
        `;
    }

    safeShow("play-again-btn");
    safeShow("mode-select-btn");
    safeShow("back-btn");
}

// --- MEMORY MATCH LOGIC ---
function startMemoryGame(pairCount) {
    safeHide("main-menu");
    safeHide("memory-mode-screen");
    safeShow("memory-game-screen");
    safeHide("memory-back-btn");

    moves = 0;
    matchedPairs = 0;
    totalPairsNeeded = pairCount;
    flippedCards = [];
    isChecking = false;

    const movesDisplay = document.getElementById("memory-moves");
    const matchesDisplay = document.getElementById("memory-matches");
    const memoryGrid = document.getElementById("memory-grid");

    if (movesDisplay) movesDisplay.innerText = "Moves: " + moves;
    if (matchesDisplay) matchesDisplay.innerText = `Matches: 0 / ${totalPairsNeeded}`;
    if (memoryGrid) {
        memoryGrid.innerHTML = "";
        memoryGrid.style.gridTemplateColumns = "repeat(4, 65px)";
    }

    const availableEmojis = ["🍁", "🍂", "🌰", "🎃", "🧣", "🍃"];
    const selectedEmojis = availableEmojis.slice(0, pairCount);
    let cardDeck = [...selectedEmojis, ...selectedEmojis];
    cardDeck.sort(() => Math.random() - 0.5);

    cardDeck.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("memory-card");
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerText = "?";

        card.addEventListener("click", () => flipCard(card));
        if (memoryGrid) memoryGrid.appendChild(card);
    });
}

function flipCard(card) {
    if (isChecking) return;
    if (card.classList.contains("flipped") || flippedCards.includes(card)) return;

    card.classList.add("flipped");
    card.innerText = card.dataset.emoji;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        const movesDisplay = document.getElementById("memory-moves");
        if (movesDisplay) movesDisplay.innerText = "Moves: " + moves;
        checkMatch();
    }
}

function checkMatch() {
    isChecking = true;
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        matchedPairs++;
        const matchesDisplay = document.getElementById("memory-matches");
        if (matchesDisplay) matchesDisplay.innerText = `Matches: ${matchedPairs} / ${totalPairsNeeded}`;
        
        flippedCards = [];
        isChecking = false;

        if (matchedPairs === totalPairsNeeded) {
            setTimeout(() => {
                const memoryGrid = document.getElementById("memory-grid");
                if (memoryGrid) {
                    memoryGrid.innerHTML = `
                        <div style='grid-column: span 4; text-align: center; margin-top: 40px;'>
                            <h2 style='color:#f39c12; font-size: 26px;'>You Won! 🎉</h2>
                            <p style='color:#f4e8c1; font-size: 18px;'>Completed in ${moves} moves</p>
                        </div>
                    `;
                }
                safeShow("memory-back-btn");
            }, 400);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card1.innerText = "?";
            card2.classList.remove("flipped");
            card2.innerText = "?";
            flippedCards = [];
            isChecking = false;
        }, 900);
    }
}

// --- APPLE BOBBING LOGIC ---
function startAppleGame(seconds) {
    if (seconds) appleDuration = seconds;
    clearAllIntervals();

    safeHide("apple-mode-screen");
    safeShow("apple-game-screen");
    
    safeHide("apple-again-btn");
    safeHide("apple-mode-btn");
    safeHide("apple-back-btn");

    appleScore = 0;
    appleTimeLeft = appleDuration;
    
    const scoreDisplay = document.getElementById("apple-score");
    const timerDisplay = document.getElementById("apple-timer");
    const appleCanvas = document.getElementById("apple-canvas");

    if (scoreDisplay) scoreDisplay.innerText = "Score: " + appleScore;
    if (timerDisplay) timerDisplay.innerText = "Time: " + appleTimeLeft + "s";
    if (appleCanvas) appleCanvas.innerHTML = "";

    appleGameInterval = setInterval(() => {
        appleTimeLeft--;
        if (timerDisplay) timerDisplay.innerText = "Time: " + appleTimeLeft + "s";
        if (appleTimeLeft <= 0) endAppleGame();
    }, 1000);

    appleSpawnerInterval = setInterval(spawnBobbingApple, 800);
}

function spawnBobbingApple() {
    if (appleTimeLeft <= 0) return;
    const appleCanvas = document.getElementById("apple-canvas");
    if (!appleCanvas) return;

    const apple = document.createElement("div");
    apple.classList.add("bobbing-apple");
    apple.innerText = "🍎";

    const maxX = appleCanvas.clientWidth - 45;
    const maxY = appleCanvas.clientHeight - 45;
    const randomX = Math.floor(Math.random() * Math.max(10, maxX));
    const randomY = Math.floor(Math.random() * Math.max(10, maxY));

    apple.style.left = randomX + "px";
    apple.style.top = randomY + "px";

    let lifeTime = setTimeout(() => {
        apple.remove();
    }, 1200);

    apple.addEventListener("mousedown", () => {
        if (appleTimeLeft > 0) {
            appleScore++;
            const scoreDisplay = document.getElementById("apple-score");
            if (scoreDisplay) scoreDisplay.innerText = "Score: " + appleScore;
            clearTimeout(lifeTime);
            apple.remove();
        }
    });

    appleCanvas.appendChild(apple);
}

function endAppleGame() {
    clearAllIntervals();
    
    const appleCanvas = document.getElementById("apple-canvas");
    if (appleCanvas) {
        appleCanvas.innerHTML = `
            <div style='margin-top: 80px; text-align: center;'>
                <h2 style='color:#f39c12; margin-bottom: 5px; font-size: 28px;'>Time's Up!</h2>
                <p style='color:#f4e8c1; font-size: 20px;'>Final Score: ${appleScore}</p>
            </div>
        `;
    }

    safeShow("apple-again-btn");
    safeShow("apple-mode-btn");
    safeShow("apple-back-btn");
}
