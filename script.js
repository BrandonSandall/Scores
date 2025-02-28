import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue, push, remove, runTransaction, get, update } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCH5jBxO8wQvaks_EX-jwQRIWNNG42bL_Q",
    authDomain: "game-scores-fun.firebaseapp.com",
    databaseURL: "https://game-scores-fun-default-rtdb.firebaseio.com",
    projectId: "game-scores-fun",
    storageBucket: "game-scores-fun.firebasestorage.app",
    messagingSenderId: "61070582415",
    appId: "1:61070582415:web:909e32bdff09a1a30346fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const playersRef = ref(database, 'players');

// Handle form submission to add a new player
document.getElementById('addPlayerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newPlayerName').value.trim();
    if (name) {
        push(playersRef, { name: name, score: 0 });
        document.getElementById('newPlayerName').value = '';
    }
});

// Update the scoreboard in real-time with sorting
onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val();
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    if (playersData) {
        const playersArray = Object.entries(playersData).map(([id, player]) => ({ id, ...player }));
        playersArray.sort((a, b) => (b.score || 0) - (a.score || 0));
        playersArray.forEach(player => {
            const div = document.createElement('div');
            div.className = 'player';
            div.innerHTML = `
                <div class="player-info">
                    <button class="delete">X</button>
                    <span class="name">${player.name}</span>: <span class="score">${player.score}</span>
                </div>
                <div class="player-controls">
                    <input type="number" class="customScore" placeholder="Score">
                    <button class="addCustom">+</button>
                    <button class="subtractCustom">-</button>
                </div>
            `;
            scoreboard.appendChild(div);

            // Add custom score
            div.querySelector('.addCustom').addEventListener('click', () => {
                const customScore = parseInt(div.querySelector('.customScore').value, 10);
                if (!isNaN(customScore)) {
                    updateScore(player.id, customScore);
                }
            });

            // Subtract custom score
            div.querySelector('.subtractCustom').addEventListener('click', () => {
                const customScore = parseInt(div.querySelector('.customScore').value, 10);
                if (!isNaN(customScore)) {
                    updateScore(player.id, -customScore);
                }
            });

            // Delete player
            div.querySelector('.delete').addEventListener('click', () => {
                if (confirm(`Remove ${player.name}?`)) {
                    remove(ref(database, 'players/' + player.id));
                }
            });
        });
    } else {
        scoreboard.innerHTML = '<p>No players yet.</p>';
    }
});

// Function to update a player's score
function updateScore(playerId, change) {
    const playerRef = ref(database, 'players/' + playerId);
    runTransaction(playerRef, (player) => {
        if (player) {
            player.score = (player.score || 0) + change;
        }
        return player;
    });
}

// Reset all scores
document.getElementById('resetAllButton').addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all scores to 0?')) {
        await resetAllScores();
    }
});

async function resetAllScores() {
    const snapshot = await get(playersRef);
    const playersData = snapshot.val();
    if (playersData) {
        const updates = {};
        Object.keys(playersData).forEach((key) => {
            updates[key + '/score'] = 0;
        });
        await update(ref(database, 'players'), updates);
    }
}