const $board = document.getElementById("board");
const $startOrResetBtn = document.getElementById("start-btn");
const $timerCount = document.getElementById("timer-count");
const $gameContainer = document.getElementById("game-container");
const $gameCompletedMessage = document.getElementById("game-completed");
const $gameDifficultyOptions = document.querySelectorAll(
  "input[name='difficulty']"
);

const $gameConfigBtn = document.getElementById("config-btn");
const $levels = document.getElementById("levels");
const $overlay = document.getElementById("overlay");

const emojiList = [
  "😀",
  "🥰",
  "🤣",
  "🤡",
  "💩",
  "🤖",
  "🧐",
  "🤔",
  "👀",
  "🗣",
  "🧑🏽‍",
  "🌚",
  "⛩",
  "🎉",
  "😬",
  "🤑",
  "👽",
  "☂️",
  "🚀",
];

const levels = {
  easy: {
    rows: 2,
    columns: 5,
    numberOfEmojis: 5,
    minutes: 1,
  },
  medium: {
    rows: 3,
    columns: 6,
    numberOfEmojis: 9,
    minutes: 2,
  },
  hard: {
    rows: 4,
    columns: 8,
    numberOfEmojis: 16,
    minutes: 3,
  },
};

let currentDifficulty = levels.easy;

const numberOfRows = currentDifficulty.rows;
const numberOfColumns = currentDifficulty.columns;

const SECONDS_IN_MINUTES = 60;
const MINUTES = currentDifficulty.minutes;

let movesCount = 0;
let time = MINUTES * SECONDS_IN_MINUTES;

let choices = [];
let activeCards = [];
let hits = [];

let gameTimer = null;
let gameIsRunning = false;

let boardEmojiList = [];

$startOrResetBtn.addEventListener("click", startOrResetGame);

$gameConfigBtn.addEventListener("click", () => {
  toggleOvelaryAndLevelsConfig();
});

$overlay.addEventListener("click", () => {
  toggleOvelaryAndLevelsConfig();
});

window.addEventListener("load", makeGameBoard);

window.addEventListener("load", () => {
  $gameDifficultyOptions.forEach((el) => {
    el.addEventListener("click", (e) => {
      controlGameLevel(e.target.id);
    });
  });
});

// Control game functions

function controlGameLevel(level) {
  currentDifficulty = levels[level];

  document.documentElement.style.setProperty(
    "--numberOfRows",
    currentDifficulty.rows
  );
  document.documentElement.style.setProperty(
    "--numberOfColumns",
    currentDifficulty.columns
  );

  time = calcGameTime();

  $timerCount.innerText = formatTime();

  toggleOvelaryAndLevelsConfig();
  makeGameBoard();
}

function makeGameBoard() {
  boardEmojiList = [];
  hits = [];
  const randomEmojis = getRandomEmojis(currentDifficulty.numberOfEmojis);

  const duplicatedAndRandomizedEmojis = duplicateAndRandomizeEmojis(
    randomEmojis
  );

  boardEmojiList.push(...duplicatedAndRandomizedEmojis);

  $board.innerHTML = generateGrid(boardEmojiList);
}

function startOrResetGame() {
  gameIsRunning = !gameIsRunning;

  gameIsRunning ? startGame() : resetGame();
}

function startGame() {
  $startOrResetBtn.innerText = "Reset";

  handleTimer();

  document.documentElement.style.setProperty("--cursorState", "pointer");
  document.documentElement.style.setProperty("--cardScale", "1.05");
}

function resetGame() {
  $startOrResetBtn.innerText = "Start";

  changeMovesCount(0);
  clearInterval(gameTimer);
  makeGameBoard();

  time = calcGameTime();

  $timerCount.innerText = formatTime();

  document.documentElement.style.setProperty("--cursorState", "not-allowed");
  document.documentElement.style.setProperty("--cardScale", "1");
}

function playAgain() {
  resetGame();
  startGame();

  gameIsRunning = true;

  showOrHiddenBoard();
  showOrHiddenGameCompletedMessage();
}

function finishGame() {
  const numberOfEmojis = (numberOfRows * numberOfColumns) / 2;

  function showCard() {
    clearInterval(gameTimer);
    showOrHiddenBoard();
    showOrHiddenGameCompletedMessage();
  }

  if (hits.length === numberOfEmojis) {
    generateFinishCard({ win: true });
    showCard();
  } else if (!gameIsRunning) {
    generateFinishCard({ win: false });
    showCard();
  }
}

function getRandomEmojis(numberOfEmojis) {
  const list = new Set();

  while (Array.from(list).length < numberOfEmojis) {
    const randomNumber = Math.floor(Math.random() * emojiList.length);
    const randomEmoji = emojiList[randomNumber];

    list.add(randomEmoji);
  }

  return list;
}

function duplicateAndRandomizeEmojis(listOfEmojis) {
  const duplicatedEmojis = [...listOfEmojis, ...listOfEmojis];

  for (let index = 0; index < duplicatedEmojis.length; index++) {
    const randomNumber = Math.floor(Math.random() * duplicatedEmojis.length);

    const randomEmoji = duplicatedEmojis[randomNumber];
    const currentEmoji = duplicatedEmojis[index];

    duplicatedEmojis[randomNumber] = currentEmoji;
    duplicatedEmojis[index] = randomEmoji;
  }

  return duplicatedEmojis;
}

function generateFinishCard(gameStatus) {
  const cardContent = ` <span>${gameStatus.win ? "🏆" : "😭"}</span>
      <h2>${gameStatus.win ? "Parabéns!!" : "Que pena..."}</h2>
      <h3>Você ${gameStatus.win ? "ganhou" : "perdeu"} o game!</h3>
      <p style="display: ${gameStatus.win ? "block" : "none"}" 
      }>Game finalizado em <span>${formatTime()}</span></p>
      <p>Você utilizou <span>${movesCount}</span> movimentos</p>
      <button onclick="playAgain()">Jogar Novamente</button>`;

  $gameCompletedMessage.innerHTML = cardContent;
}

function showOrHiddenBoard() {
  $gameContainer.classList.toggle("main-container-hidden");
}

function showOrHiddenGameCompletedMessage() {
  $gameCompletedMessage.classList.toggle("game-completed-hidden");
}

function generateGrid(list) {
  const gridCards = list
    .map(
      (emoji, index) =>
        `<div class="card" id="card-${index}" onclick="handleCardClick(${index}, '${emoji}')">?</div>`
    )
    .join("");

  return gridCards;
}

// Control cards functions

function handleCardClick(index, emoji) {
  if (hits.includes(emoji) || !gameIsRunning) {
    return;
  }

  choices.push({ id: `card-${index}`, emoji });

  const $card = document.getElementById(`card-${index}`);
  $card.innerText = emoji;

  activeCards.push($card);

  if (choices.length === 2) {
    changeMovesCount(movesCount + 1);
    correctCombo();
    resetCard();
  }
}

function resetCard() {
  activeCards = [];

  setTimeout(() => {
    choices.forEach(({ id }) => {
      const $card = document.getElementById(id);

      if ($card) {
        $card.innerText = "?";
      }
    });

    choices = [];
  }, 500);
}

// Control game status

function correctCombo() {
  if (choices[0]?.emoji === choices[1]?.emoji) {
    hits.push(choices[0].emoji);

    choices = [];

    activeCards.forEach((card) => {
      card.style.backgroundColor = "#fff";
    });

    finishGame();

    return;
  }
}

function changeMovesCount(val) {
  movesCount = val;
  const $moves = document.getElementById("moves-count");
  $moves.innerHTML = `Moves: ${movesCount}`;
}

function formatTime() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  const formatedTime = `${minutes}:${seconds}`;

  return formatedTime;
}

function handleTimer() {
  time = calcGameTime();

  gameTimer = setInterval(() => {
    if (time === 0) {
      clearInterval(gameTimer);

      gameIsRunning = false;

      finishGame(false);
      resetGame();
      return;
    }

    time -= 1;

    $timerCount.innerText = formatTime();
  }, 1000);
}

function calcGameTime() {
  return currentDifficulty.minutes * SECONDS_IN_MINUTES;
}

function toggleOvelaryAndLevelsConfig() {
  $levels.classList.toggle("levels-hidden");
  $overlay.classList.toggle("overlay-hidden");
}
