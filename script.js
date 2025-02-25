async function loadScores() {
    const response = await fetch('/scores');
    const players = await response.json();
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
            div.innerHTML = `${player.name}: ${player.score}
                <button onclick="updateScore('${player.name}', 1)">+1</button>
                <button onclick="updateScore('${player.name}', -1)">-1</button>
                <button onclick="removePlayer('${player.name}')">Delete</button>`;
            scoreboard.appendChild(div);
        });
    }
}

async function addPlayer() {
    const name = document.getElementById('newPlayerName').value.trim();
    if (name) {
        const response = await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (response.ok) {
            loadScores(); // Refresh the player list
            document.getElementById('newPlayerName').value = ''; // Clear the input
        } else {
            alert('Player already exists or invalid name.');
        }
    }
}

async function removePlayer(name) {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
        await fetch('/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        loadScores(); // Refresh the player list
    }
}

async function updateScore(name, change) {
    await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, change })
    });
    loadScores(); // Refresh the player list
}

window.onload = loadScores; // Load players when the page loads