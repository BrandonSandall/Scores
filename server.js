const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
app.use(express.json());

const db = new sqlite3.Database('scores.db');
db.run('CREATE TABLE IF NOT EXISTS players (name TEXT PRIMARY KEY, score INTEGER)');

// Sample family members (run this once to initialize)
const family = ['Mom', 'Dad', 'Kid1', 'Kid2'];
family.forEach(name => {
    db.run('INSERT OR IGNORE INTO players (name, score) VALUES (?, 0)', [name]);
});

app.get('/scores', (req, res) => {
    db.all('SELECT * FROM players', (err, rows) => {
        res.json(rows);
    });
});

app.post('/update', (req, res) => {
    const { name, change } = req.body;
    db.run('UPDATE players SET score = score + ? WHERE name = ?', [change, name], () => {
        res.sendStatus(200);
    });
});

app.post('/add', (req, res) => {
    const { name } = req.body;
    if (name) {
        db.get('SELECT name FROM players WHERE name = ?', [name], (err, row) => {
            if (row) {
                res.status(400).send('Player already exists');
            } else {
                db.run('INSERT INTO players (name, score) VALUES (?, 0)', [name], () => {
                    res.sendStatus(200);
                });
            }
        });
    } else {
        res.status(400).send('Invalid name');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));