let moves = 0;
let matchedCards = [];
let lockBoard = false;

async function startGame() {
  const response = await fetch('cards.json');
  const data = await response.json();
  let cards = shuffle(data.cards);

    document.getElementById('restart-btn').addEventListener('click', restartGame);
  const gameBoard = document.getElementById('gameboard');
  const congratsText = document.getElementById('congrats-text');

  let flippedCards = [];

  cards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.name = card.name;

    cardElement.addEventListener('click', () => {
      if (lockBoard || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
        return;
      }

      cardElement.classList.add('flipped');
      cardElement.style.backgroundImage = `url('${card.img}')`;
      flippedCards.push(cardElement);

      if (flippedCards.length === 2) {
        lockBoard = true;
        moves++;
        updateMoves();
        setTimeout(() => {
          checkForMatch(flippedCards);
          lockBoard = false;
        }, 1000);
      }
    });

    gameBoard.appendChild(cardElement);
  });
}

function checkForMatch(flippedCards) {
  const [card1, card2] = flippedCards;

  if (card1.dataset.name === card2.dataset.name) {
    card1.classList.add('matched');
    card2.classList.add('matched');

    // Add border to matched cards to make them more visible
    card1.style.border = '2px solid rgb(122, 219, 219, 0.7)';
    card2.style.border = '2px solid rgb(122, 219, 219, 0.7)';
    matchedCards.push(card1, card2);
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.style.backgroundImage = '';
    card2.style.backgroundImage = '';
  }

  flippedCards.length = 0;

  if (matchedCards.length === document.getElementById('gameboard').children.length) {
    showCongratulations();
    addToResultList();
  }
}

function updateMoves() {
  const movesElement = document.getElementById('moves');
  movesElement.textContent = `${moves}`;
}

function addToResultList() {
  const resultList = document.getElementById('result-list');
  const resultItem = document.createElement('li');
  resultItem.classList.add('result-item');
  resultItem.textContent = `${moves}`;
  resultList.appendChild(resultItem);
}

function showCongratulations() {
  const congratsText = document.getElementById('congrats-text');
  congratsText.style.display = 'block';
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

async function restartGame() {
    // Reset game state
    const gameBoard = document.getElementById('gameboard');
    gameBoard.innerHTML = ''; // Clear the game board
    flippedCards = [];
    matchedCards = [];s
    moves = 0;
    updateMoves(); 
    // remove the congratulations text
    const congratsText = document.getElementById('congrats-text');
    congratsText.style.display = 'none';
    
    // Reinitialize the game
    await startGame();
  }
  
startGame();
