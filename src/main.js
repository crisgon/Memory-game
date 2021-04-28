const $board = document.getElementById("board");

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

const numberOfRows = 4;
const numberOfColumns = 4;

let movesCount = 0;

let choices = [];
let hits = [];

const boardEmojiList = [];

window.addEventListener("load", () => {
  const randomEmojis = getRandomEmojis((numberOfRows * numberOfColumns) / 2);

  const duplicatedAndRandomizedEmojis = duplicateAndRandomizeEmojis(
    randomEmojis
  );

  boardEmojiList.push(...duplicatedAndRandomizedEmojis);

  $board.innerHTML = generateGrid(boardEmojiList);
});

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
  if (hits.includes(emoji)) {
    return;
  }

  choices.push({ id: `card-${index}`, emoji });

  const $card = document.getElementById(`card-${index}`);
  $card.innerText = emoji;

  if (choices.length === 2) {
    changeMovesCount();

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
  }, 800);
}

function changeMovesCount() {
  movesCount += 1;
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
