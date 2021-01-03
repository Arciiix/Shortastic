import { log } from "./log";

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.db", (err) => {
  if (err) {
    return log(`Couldn't connect to the database: ${err}`, true);
  } else {
    log(`Connected to the database successfully`);
  }
});

function getTheURL(short: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM URLs WHERE shortenedLink = ?`, short, (err, rows) => {
      if (err)
        reject(log(`Error while getting data from the database: ${err}`));
      resolve(rows);
    });
  });
}

function createTheURL(short: string, full: string): Promise<void> {
  return new Promise((resolve, reject) => {
    //DEV TODO: Pass the correct accountId, isProtected and password values
    db.run(
      `INSERT INTO URLs (id, shortenedLink, fullLink, accountId, isProtected, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [null, short, full, null, false, null],
      (err) => {
        if (err) reject(log(`Error while inserting into the database: ${err}`));
        log(`Added new link to the database`);
        resolve();
      }
    );
  });
}

export { getTheURL, createTheURL };
