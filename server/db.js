import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

let db = null;

export async function initDb() {
  try {
    // Ensure the database directory exists
    const dbDir = dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Remove existing database if it's corrupted
    try {
      if (fs.existsSync(dbPath)) {
        await open({
          filename: dbPath,
          driver: sqlite3.Database
        });
      }
    } catch (err) {
      if (err.code === 'SQLITE_NOTADB') {
        console.log('Removing corrupted database file...');
        fs.unlinkSync(dbPath);
      }
    }

    // Create and initialize new database
    console.log('Initializing database...');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
      mode: sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE
    });
    
    // Initialize schema and seed data in a transaction
    await db.exec('BEGIN TRANSACTION;');
    
    try {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          department TEXT NOT NULL,
          officials TEXT NOT NULL,
          date TEXT NOT NULL,
          url TEXT NOT NULL UNIQUE,
          source TEXT
        );

        CREATE TABLE IF NOT EXISTS officials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          department TEXT NOT NULL,
          mentions_count INTEGER DEFAULT 0
        );
      `);

      // Seed initial data
      const officials = [
        ['Joe Biden', 'Executive'],
        ['Janet Yellen', 'Treasury'],
        ['Antony Blinken', 'State'],
        ['Pete Buttigieg', 'Transportation'],
        ['John Fetterman', 'Senate']
      ];

      for (const [name, department] of officials) {
        await db.run(
          'INSERT OR IGNORE INTO officials (name, department, mentions_count) VALUES (?, ?, 0)',
          [name, department]
        );
      }

      await db.exec('COMMIT;');
      console.log('Database initialized successfully');
      return db;
    } catch (error) {
      await db.exec('ROLLBACK;');
      throw error;
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export async function getDb() {
  if (!db) {
    db = await initDb();
  }
  return db;
}