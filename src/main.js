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
  "🧑🏽‍💻",
  "🌚",
  "⛩",
  "🎉",
  "😬",
];

const numberOfRows = 4;
const numberOfColumns = 4;

window.addEventListener("load", () => {
  $board.innerHTML = generateGrid(numberOfRows, numberOfColumns);

  console.log(getRandomEmojis(6));
});

function generateGrid(rows, columns) {
  let gridCards = "";
  for (let i = 0; i < rows * columns; i++) {
    gridCards += `<div class="card">?</div>`;
  }

  return gridCards;
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
