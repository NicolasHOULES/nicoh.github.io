const soundMap = {
    'do': 'sounds/do.wav',
    're': 'sounds/re.wav',
    'mi': 'sounds/mi.wav',
    'fa': 'sounds/fa.wav',
    'sol': 'sounds/sol.wav',
    'la': 'sounds/la.wav',
    'si': 'sounds/si.wav',
    'do-diese': 'sounds/dos.wav',
    're-diese': 'sounds/res.wav',
    'fa-diese': 'sounds/fas.wav',
    'sol-diese': 'sounds/sols.wav',
    'la-diese': 'sounds/las.wav',
};

function playSound(key) {
    const audio = new Audio(soundMap[key]);
    audio.play();
}

function handleKeyPressAnimation(keyElement) {
    keyElement.classList.add('pressed');
    setTimeout(() => {
        keyElement.classList.remove('pressed');
    }, 150);
}

document.querySelectorAll('.becarre').forEach(key => {
    key.addEventListener('click', () => {
        playSound(key.id);
        handleKeyPressAnimation(key);
    });
});

document.querySelectorAll('.diese').forEach(key => {
    key.addEventListener('click', () => {
        playSound(key.id);
        handleKeyPressAnimation(key);
    });
});

document.addEventListener('keydown', (event) => {
    let keyPressed;
    switch (event.key) {
        case 'q': keyPressed = 'do'; break;
        case 'z': keyPressed = 'do-diese'; break;
        case 's': keyPressed = 're'; break;
        case 'e': keyPressed = 're-diese'; break;
        case 'd': keyPressed = 'mi'; break;
        case 'f': keyPressed = 'fa'; break;
        case 't': keyPressed = 'fa-diese'; break;
        case 'g': keyPressed = 'sol'; break;
        case 'y': keyPressed = 'sol-diese'; break;
        case 'h': keyPressed = 'la'; break;
        case 'u': keyPressed = 'la-diese'; break;
        case 'j': keyPressed = 'si'; break;
        default: return;
    }

    const keyElement = document.getElementById(keyPressed);
    if (keyElement) {
        playSound(keyPressed);
        handleKeyPressAnimation(keyElement);
    }
});




let score = 0;
let timeLeft = 30;
let activeNote = null;
let gameInterval, timerInterval;
let bestScore = localStorage.getItem("bestScore") || 0; // Charger le meilleur score depuis le localStorage
let gameStarted = false; // Indicateur pour savoir si le jeu a commencé ou non

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const bestScoreElement = document.getElementById("bestScore");

// Affichage du meilleur score au départ
bestScoreElement.textContent = `Meilleur score: ${bestScore}`;

// Tableau des touches
const keys = document.querySelectorAll(".becarre, .diese");

// Fonction pour réinitialiser toutes les touches
function resetKeys() {
    keys.forEach(key => {
        key.classList.remove("active");
    });
}

// Fonction pour choisir une touche aléatoire
function activateRandomKey() {
    resetKeys();
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    randomKey.classList.add("active");
    activeNote = randomKey;
}

// Fonction pour afficher un message près de la touche cliquée
function showScoreChange(message, x, y) {
    const scoreMessage = document.createElement('div');
    scoreMessage.textContent = message;
    scoreMessage.style.position = 'absolute';
    scoreMessage.style.left = `${x}px`;
    scoreMessage.style.top = `${y}px`;
    scoreMessage.style.color = message === '+10' ? 'green' : 'red';
    scoreMessage.style.fontWeight = 'bold';
    scoreMessage.style.fontSize = '20px';
    document.body.appendChild(scoreMessage);

    setTimeout(() => {
        scoreMessage.remove();
    }, 500); // Supprimer après 500ms
}

// Fonction de gestion du score
function handleClick(event) {
    if (!gameStarted) return; // Ne pas faire avancer le jeu si il n'est pas lancé
    if (event.target === activeNote) {
        score += 10;
        showScoreChange('+10', event.clientX, event.clientY); // Afficher +10 près de la touche
        scoreElement.textContent = `Score: ${score}`;
        activateRandomKey();
    } else {
        score -= 5;
        showScoreChange('-5', event.clientX, event.clientY); // Afficher -5 près de la touche
        scoreElement.textContent = `Score: ${score}`;
    }
}

// Fonction pour gérer le timer
function updateTimer() {
    timeLeft--;
    timerElement.textContent = `Temps restant: ${timeLeft}s`;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        clearInterval(gameInterval);
        alert(`Jeu terminé ! Votre score est ${score}`);
        
        // Mettre à jour le meilleur score
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("bestScore", bestScore); // Sauvegarder le meilleur score
            bestScoreElement.textContent = `Meilleur score: ${bestScore}`;
        }

        startButton.style.display = 'block'; // Afficher le bouton "Commencer"
        gameStarted = false; // Marquer que le jeu est terminé
    }
}

// Initialisation du jeu
function startGame() {
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Temps restant: ${timeLeft}s`;
    startButton.style.display = 'none'; // Cacher le bouton "Commencer"
    gameStarted = true; // Marquer que le jeu a commencé
    gameInterval = setInterval(activateRandomKey, 1000); // Change la touche toutes les 1s
    timerInterval = setInterval(updateTimer, 1000); // Mise à jour du timer toutes les 1s
}

// Lancer le jeu au clic sur le bouton "Commencer"
startButton.addEventListener("click", startGame);

// Lancer le jeu au clic sur une touche active
document.body.addEventListener("click", handleClick);
