let players = [];

function loadPlayers() {
    const stored = localStorage.getItem('players');
    if (stored) {
        players = JSON.parse(stored);
    }
}

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}

function renderPlayers() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = ''; // Clear the current display

    if (players.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No players yet. Add some players to start.';
        scoreboard.appendChild(p);
    } else {
        players.forEach(player => {
            const div = document.createElement('div');
            div.className = 'player';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.name;
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = `: ${player.score}`;
            const addButton = document.createElement('button');
            addButton.textContent = '+1';
            addButton.addEventListener('click', () => updateScore(player.name, 1));
            const subtractButton = document.createElement('button');
            subtractButton.textContent = '-1';
            subtractButton.addEventListener('click', () => updateScore(player.name, -1));
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => removePlayer(player.name));
            div.appendChild(nameSpan);
            div.appendChild(scoreSpan);
            div.appendChild(addButton);
            div.appendChild(subtractButton);
            div.appendChild(deleteButton);
            scoreboard.appendChild(div);
        });
    }
}

function addPlayer() {
    const nameInput = document.getElementById('newPlayerName');
    const name = nameInput.value.trim();
    if (name && !players.some(p => p.name === name)) {
        players.push({ name, score: 0 });
        savePlayers();
        renderPlayers();
        nameInput.value = '';
    } else if (!name) {
        alert('Please enter a name.');
    } else {
        alert('Player already exists.');
    }
}

function removePlayer(name) {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
        players = players.filter(p => p.name !== name);
        savePlayers();
        renderPlayers();
    }
}

function updateScore(name, change) {
    const player = players.find(p => p.name === name);
    if (player) {
        player.score += change;
        savePlayers();
        renderPlayers();
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
    renderPlayers();
    document.getElementById('addButton').addEventListener('click', addPlayer);
});