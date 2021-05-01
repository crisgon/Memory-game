const $board = document.getElementById("board");
const $startOrResetBtn = document.getElementById("start-btn");
const $timerCount = document.getElementById("timer-count");
const $gameContainer = document.getElementById("game-container");
const $gameCompletedMessage = document.getElementById("game-completed");
const $playAgainBtn = document.getElementById("play-again-btn");
const $gameCompletedTime = document.getElementById("game-completed-time");
const $gameCompletedMovesCount = document.getElementById(
  "game-completed-moves"
);

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

const numberOfRows = 3;
const numberOfColumns = 6;

const SECONDS_IN_MINUTES = 60;
const MINUTES = 1;

let movesCount = 0;
let time = MINUTES * SECONDS_IN_MINUTES;

let choices = [];
let activeCards = [];
let hits = [];

let gameTimer = null;
let gameIsRunning = false;

let boardEmojiList = [];

$startOrResetBtn.addEventListener("click", startOrResetGame);

$playAgainBtn.addEventListener("click", () => {
  resetGame();
  startGame();
  showOrHiddenBoard();
  showOrHiddenGameCompletedMessage();
});

window.addEventListener("load", makeGameBoard);

function makeGameBoard() {
  boardEmojiList = [];
  hits = [];
  const randomEmojis = getRandomEmojis((numberOfRows * numberOfColumns) / 2);

  const duplicatedAndRandomizedEmojis = duplicateAndRandomizeEmojis(
    randomEmojis
  );

  boardEmojiList.push(...duplicatedAndRandomizedEmojis);

  console.log(boardEmojiList);

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
  $timerCount.innerText = "01:00";

  document.documentElement.style.setProperty("--cursorState", "not-allowed");
  document.documentElement.style.setProperty("--cardScale", "1");
}

function finishGame() {
  const numberOfEmojis = (numberOfRows * numberOfColumns) / 2;
  if (hits.length === numberOfEmojis) {
    clearInterval(gameTimer);

    $gameCompletedTime.innerText = formatTime();
    $gameCompletedMovesCount.innerText = movesCount;

    showOrHiddenBoard();
    showOrHiddenGameCompletedMessage();
  }
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

function formatTime() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  const formatedTime = `${minutes}:${seconds}`;

  return formatedTime;
}

function handleTimer() {
  time = MINUTES * SECONDS_IN_MINUTES;

  gameTimer = setInterval(() => {
    if (time === 0) {
      clearInterval(gameTimer);
      resetGame();
      gameIsRunning = false;
      console.log({ gameIsRunning });
      return;
    }

    time -= 1;
    $timerCount.innerText = formatTime();
  }, 1000);
}
