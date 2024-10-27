const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'video.db'), (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');

    // Create the videos table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        videoId TEXT UNIQUE,
        title TEXT,
        publishDate TEXT
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    // Create the fetch_info table to store the last fetch time if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS fetch_info (
        id INTEGER PRIMARY KEY,
        last_fetch TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
});

module.exports = db;
