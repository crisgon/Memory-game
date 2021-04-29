const $board = document.getElementById("board");
const $startOrResetBtn = document.getElementById("start-btn");
const $timerCount = document.getElementById("timer-count");

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
const MINUTES = 0.1;

let movesCount = 0;

let choices = [];
let hits = [];

let gameTimer = null;
let gameIsRunning = false;

const boardEmojiList = [];

$startOrResetBtn.addEventListener("click", startOrResetGame);

window.addEventListener("load", () => {
  const randomEmojis = getRandomEmojis((numberOfRows * numberOfColumns) / 2);

  const duplicatedAndRandomizedEmojis = duplicateAndRandomizeEmojis(
    randomEmojis
  );

  boardEmojiList.push(...duplicatedAndRandomizedEmojis);

  $board.innerHTML = generateGrid(boardEmojiList);
});

function startOrResetGame() {
  gameIsRunning = !gameIsRunning;

  if (gameIsRunning) {
    $startOrResetBtn.innerText = "Reset";

    handleTimer();
    document.documentElement.style.setProperty("--cursorState", "pointer");
    document.documentElement.style.setProperty("--cardScale", "1.05");
  } else {
    $startOrResetBtn.innerText = "Start";

    changeMovesCount(0);
    clearInterval(gameTimer);
    $timerCount.innerText = "03:00";

    document.documentElement.style.setProperty("--cursorState", "not-allowed");
    document.documentElement.style.setProperty("--cardScale", "1");
  }
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

  if (choices.length === 2) {
    changeMovesCount(movesCount + 1);

    if (choices[0]?.emoji === choices[1]?.emoji) {
      hits.push(choices[0].emoji);

      choices = [];
      return;
    }

    resetCard();
  }
}

function resetCard() {
  setTimeout(() => {
    choices.forEach(({ id }) => {
      const $card = document.getElementById(id);

      if ($card) {
        $card.innerText = "?";
      }
    });

    choices = [];
  }, 400);
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

function handleTimer() {
  let time = MINUTES * SECONDS_IN_MINUTES;
  let minutes = 3;
  let seconds = 0;

  gameTimer = setInterval(() => {
    if (time === 0) {
      clearInterval(gameTimer);
      return;
    }

    time -= 1;
    minutes = Math.floor(time / 60);
    seconds = time % 60;

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    $timerCount.innerText = `${minutes}:${seconds}`;
  }, 1000);
}
