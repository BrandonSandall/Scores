async function loadScores() {
    const response = await fetch('/scores');
    const players = await response.json();
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.className = 'player';
        div.innerHTML = `${player.name}: ${player.score}
            <button onclick="updateScore('${player.name}', 1)">+1</button>
            <button onclick="updateScore('${player.name}', -1)">-1</button>`;
        scoreboard.appendChild(div);
    });
}

async function updateScore(name, change) {
    await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, change })
    });
    loadScores(); // Refresh the scores
}

window.onload = loadScores;