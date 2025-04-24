const DICTIONNAIRE = [
  "ARBRE",
  "PLAGE",
  "SUCRE",
  "TABLE",
  "LIVRE",
  "FRUIT",
  "VERRE",
  "SAVON",
  "FLEUR",
  "IMAGE",
  "TASSE",
  "NUAGE",
  "SOLEIL",
  "MONDE",
  "CLOUS",
  "SOURIS",
  "COEUR", // Tous en 5 lettres
];

const RANDOM_WORD = Math.floor(Math.random() * DICTIONNAIRE.length);
console.log(RANDOM_WORD);

const SECRET_WORD = DICTIONNAIRE[
  Math.floor(Math.random() * DICTIONNAIRE.length)
]
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, ""); // Supprime les accents

console.log(SECRET_WORD);

let gameOver = false;

const ROWS = 6;
const COLS = 5;

let currentRow = 0;
let currentCell = 0;

let pastAttempts = []; // Stocke les feedbacks des tentatives

// Création de la grille
function createGrid() {
  const grid = document.getElementById("grid");
  console.log(grid);

  for (let i = 0; i < ROWS; i++) {
    const row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < COLS; j++) {
      const cell = document.createElement("div");
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
  // console.log(keyboard);

  const layout = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "Backspace"],
    ["L", "M", "W", "X", "C", "V", "B", "N", "Enter"],
  ];

  layout.forEach((rowLetters) => {
    const row = document.createElement("div");
    // console.log(row);
    row.className = "keyboard-row";

    rowLetters.forEach((letter) => {
      const key = document.createElement("button");
      // console.log(letter);

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
  if (gameOver) return;

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
  if (gameOver) return;

  const currentCells = document.querySelectorAll(`[data-row="${currentRow}"]`);
  const guessedWord = Array.from(currentCells)
    .map((cell) => cell.textContent)
    .join("");

  // Vérification de la longueur
  if (guessedWord.length !== COLS) {
    alert("Veuillez remplir toutes les cases avant de valider");
    return;
  }

  let secret = SECRET_WORD.toUpperCase(); // Conversion en majuscules
  const guess = guessedWord.toUpperCase(); // Conversion en majuscules
  const feedback = [];

  // Premier passage : lettres correctes (vertes)
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === secret[i]) {
      feedback[i] = "correct";
      secret = secret.slice(0, i) + "-" + secret.slice(i + 1); // Lettre traitée
    }
  }

  // Deuxième passage : lettres mal placées (jaunes)
  for (let i = 0; i < COLS; i++) {
    if (!feedback[i]) {
      // Si la lettre n'est pas déjà correcte
      if (secret.includes(guess[i])) {
        feedback[i] = "present";
        secret = secret.replace(guess[i], "-"); // Remplace la première occurrence
      } else {
        feedback[i] = "absent";
      }
    }
  }

  applyFeedback(feedback, currentCells);

  // Vérifier la victoire
  if (feedback.every((status) => status === "correct")) {
    gameOver = true;
    setTimeout(() => alert(`Gagné en ${currentRow + 1} essai(s) ! 🎉`), 100);
    return;
  }

  // Passer à la ligne suivante
  currentRow++;
  currentCell = 0;

  // Vérifier la défaite
  if (currentRow >= ROWS) {
    gameOver = true;
    setTimeout(() => alert(`Perdu... Le mot était : ${SECRET_WORD}`), 100);
  }
}

function applyFeedback(feedback, cells) {
  // // Dans applyFeedback()
  // if (key && !key.classList.contains("correct")) {
  //   key.classList.add(feedback[index]);
  // }

  // Met à jour les cases
  cells.forEach((cell, index) => {
    cell.classList.add(feedback[index]);
  });

  // Met à jour le clavier
  cells.forEach((cell, index) => {
    const key = document.querySelector(`[data-key="${cell.textContent}"]`);
    if (key && !key.classList.contains("correct")) {
      key.classList.add(feedback[index]);
    }
  });
}

// Modal
function showModal(isVictory) {
  const modal = document.getElementById("gameModal");
  const title = document.getElementById("modalTitle");
  const subtitle = document.getElementById("modalSubtitle");
  const attemptCount = document.getElementById("attemptCount");
  const historyContainer = document.getElementById("attemptsHistory");

  // Configuration du contenu
  title.textContent = isVictory ? "🎉 Félicitations !" : "Dommage...";
  subtitle.textContent = isVictory
    ? `Vous avez trouvé en ${currentRow + 1} essai${currentRow > 0 ? "s" : ""}`
    : `Le mot secret était : ${SECRET_WORD}`;

  // Génération de l'historique
  historyContainer.innerHTML = "";
  pastAttempts.forEach((feedback) => {
    const row = document.createElement("div");
    row.className = "attempt-row";

    feedback.forEach((status) => {
      const cell = document.createElement("div");
      cell.className = `mini-cell ${status}`;
      row.appendChild(cell);
    });

    historyContainer.appendChild(row);
  });

  modal.classList.remove("hidden");
}

// Reset
function resetGame() {
  // Réinitialisation état
  currentRow = 0;
  currentCell = 0;
  gameOver = false;
  pastAttempts = [];

  // Réinitialisation visuelle
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.className = "cell";
  });

  document.querySelectorAll(".key").forEach((key) => {
    key.className = "key";
  });

  // Nouveau mot secret
  SECRET_WORD = DICTIONNAIRE[Math.floor(Math.random() * DICTIONNAIRE.length)]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Fermer la modale
  document.getElementById("gameModal").classList.add("hidden");
}
