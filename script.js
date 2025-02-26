// Replace this with your Firebase configuration from Step 1
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const playersRef = database.ref('players');

// Add a new player
document.getElementById('addPlayerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newPlayerName').value.trim();
    if (name) {
        playersRef.push({ name: name, score: 0 });
        document.getElementById('newPlayerName').value = '';
    }
});

// Update the scoreboard in real-time
playersRef.on('value', (snapshot) => {
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
                    playersRef.child(id).remove();
                }
            });
        });
    } else {
        scoreboard.innerHTML = '<p>No players yet.</p>';
    }
});

// Function to update scores
function updateScore(playerId, change) {
    const playerRef = playersRef.child(playerId);
    playerRef.transaction((player) => {
        if (player) {
            player.score = (player.score || 0) + change;
        }
        return player;
    });
}