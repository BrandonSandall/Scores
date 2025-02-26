// Import Firebase app and Realtime Database functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue, push, update, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Your Firebase configuration
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

// Add a new player
document.getElementById('addPlayerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newPlayerName').value.trim();
    if (name) {
        push(playersRef, { name: name, score: 0 });
        document.getElementById('newPlayerName').value = '';
    }
});

// Update the scoreboard in real-time
onValue(playersRef, (snapshot) => {
    const players = snapshot.val();
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    if (players) {
        Object.entries(players).forEach(([id, player]) => {
            const div = document.createElement('div');
            div.className = 'player';
            div.innerHTML = `
                <span class="name">${player.name}</span>: <span class="score">${player.score}</span>
                <input type="number" class="customScore" placeholder="Custom amount">
                <button class="addCustom">Add</button>
                <button class="subtractCustom">Subtract</button>
                <button class="delete">Delete</button>
            `;
            scoreboard.appendChild(div);

            // Add custom score
            div.querySelector('.addCustom').addEventListener('click', () => {
                const customScore = parseInt(div.querySelector('.customScore').value, 10);
                if (!isNaN(customScore)) {
                    updateScore(id, customScore);
                }
            });

            // Subtract custom score
            div.querySelector('.subtractCustom').addEventListener('click', () => {
                const customScore = parseInt(div.querySelector('.customScore').value, 10);
                if (!isNaN(customScore)) {
                    updateScore(id, -customScore);
                }
            });

            // Delete player
            div.querySelector('.delete').addEventListener('click', () => {
                if (confirm(`Remove ${player.name}?`)) {
                    remove(ref(database, 'players/' + id));
                }
            });
        });
    } else {
        scoreboard.innerHTML = '<p>No players yet.</p>';
    }
});

// Function to update scores
function updateScore(playerId, change) {
    const playerRef = ref(database, 'players/' + playerId);
    onValue(playerRef, (snapshot) => {
        const player = snapshot.val();
        if (player) {
            const newScore = (player.score || 0) + change;
            update(playerRef, { score: newScore });
        }
    }, { onlyOnce: true });
}