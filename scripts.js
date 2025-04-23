const tabWords = [
  "pomme",
  "livre",
  "chant",
  "verte",
  "sable",
  "plume",
  "douce",
  "sucre",
  "angle",
  "train",
  "verre",
  "table",
  "image",
  "jaune",
  "nuage",
];
console.log(tabWords.length);

console.log(tabWords[0]);

const indexAléatoires = Math.floor(Math.random() * tabWords.length);
console.log(indexAléatoires);

const motsAléatoires = tabWords[indexAléatoires];
console.log(motsAléatoires);

const SECRET_WORD = "TABLE";

const ROWS = 6;
const COLS = 5;

let currentRow = 0;
let currentCell = 0;

// Création de la grille
function createGrid() {
  const grid = document.getElementById("grid");
  console.log(grid);

  for (let i = 0; i < ROWS; i++) {
    const row = document.createElement("span");
    row.className = "row";

    for (let j = 0; j < COLS; j++) {
      const cell = document.createElement("span");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.cell = j;
      row.appendChild(cell);
    }

    grid.appendChild(row);
  }
}

// Création du clavier
function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  console.log(keyboard);

  const layout = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "Backspace"],
    ["L", "M", "W", "X", "C", "V", "B", "N", "Enter"],
  ];

  layout.forEach((rowLetters) => {
    const row = document.createElement("span");
    console.log(row);
    row.className = "keyboard-row";

    rowLetters.forEach((letter) => {
      const key = document.createElement("button");
      console.log(letter);

      key.className = "key";
      key.textContent = letter;
      key.dataset.key = letter;

      row.appendChild(key);
    });

    keyboard.appendChild(row);
  });
}

// Gestion des touches
function handleKeyPress(key) {
  const keyElement = document.querySelector(`[data-key="${key}"]`);

  if (keyElement) {
    keyElement.classList.add("pressed");
    setTimeout(() => keyElement.classList.remove("pressed"), 100);
  }

  const cells = document.querySelectorAll(`[data-row="${currentRow}"]`);

  if (key === "Backspace") {
    if (currentCell > 0) {
      currentCell--;
      cells[currentCell].textContent = "";
    }
  } else if (key === "Enter") {
    if (currentCell === COLS) {
      validateRow();
    }
  } else if (/^[A-Z]$/.test(key)) {
    if (currentCell < COLS) {
      cells[currentCell].textContent = key;
      currentCell++;
    }
  }
}

// Evénements
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleKeyPress("Enter");
  else if (e.key === "Backspace") handleKeyPress("Backspace");
  else if (e.key.length === 1) handleKeyPress(e.key.toUpperCase());
});

document.getElementById("keyboard").addEventListener("click", (e) => {
  if (e.target.matches(".key")) {
    handleKeyPress(e.target.dataset.key);
  }
});

createGrid();
createKeyboard();

// Vérification que toutes les cases sont bien remplies de lettre
function validateRow() {
  const currentCells = document.querySelectorAll(`[data-row="${currentRow}"]`);
  const guessedWord = Array.from(currentCells)
    .map((cell) => cell.textContent)
    .join("");

  // Vérification des lettres remplies
  if (guessedWord.length !== COLS) {
    alert("Veuillez remplir toutes les cases avant de valider");
    return;
  }

  const secret = SECRET_WORD.toUpperCase();
  const guess = guessedWord.toUpperCase();
  const feedback = [];

  // Premier passage : marquer les lettres correctes (vertes)

  for (let i = 0; i < COLS; i++) {
    if (guess[i] === secret[i]) {
      feedback[i] = "correct";
      secret = secret.slice(0, i);
    }
  }
}
