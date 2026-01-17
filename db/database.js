const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("retro_games.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      publisher TEXT,
      yearPublished INTEGER,
      system TEXT,
      condition TEXT,
      previousOwners INTEGER,
      ownerId INTEGER,
      FOREIGN KEY(ownerId) REFERENCES users(id)
    )
  `);
});

module.exports = db;
