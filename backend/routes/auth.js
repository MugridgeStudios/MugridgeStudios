const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database.sqlite');

// Create tables if they don't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  course TEXT,
  completed INTEGER DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`);

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, hash], function(err) {
    if(err) return res.status(400).json({ error: err.message });
    res.json({ success: true, userId: this.lastID });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
    if(err) return res.status(500).json({ error: err.message });
    if(!row) return res.status(400).json({ error: "User not found" });
    const match = await bcrypt.compare(password, row.password);
    if(match) res.json({ success: true, userId: row.id });
    else res.status(400).json({ error: "Incorrect password" });
  });
});

// Save progress
router.post('/progress', (req, res) => {
  const { userId, course, completed } = req.body;
  db.run(`INSERT OR REPLACE INTO progress(user_id, course, completed) VALUES(?, ?, ?)`,
    [userId, course, completed], function(err){
      if(err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

// Get progress
router.get('/progress/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all(`SELECT * FROM progress WHERE user_id = ?`, [userId], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
