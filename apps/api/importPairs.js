/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');
const csv = require('csv-parser');
const fs = require('fs');
const { join } = require('path');
require('dotenv').config({ path: join(__dirname, '../../', '.env') });

const DB_NAME = process.env.DB_NAME;

((db) => {
  if (!db) {
    console.log(`DB not found.`);
    return;
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS pairs (
      id INTEGER PRIMARY KEY,
      pair TEXT,
      assetClass TEXT,
      baseIso TEXT,
      baseName TEXT,
      baseCountry TEXT,
      quoteIso TEXT,
      quoteName TEXT,
      quoteCountry TEXT
    );
  `);

  const pairsTable = db.prepare('SELECT EXISTS(SELECT 1 FROM pairs) AS exist').get();

  if (pairsTable?.exist) {
    console.log(`The CSV file has already been imported.`);
    db.close();
    return;
  }

  const insertRow = db.prepare(`
    INSERT INTO pairs (id, pair, assetClass, baseIso, baseName, baseCountry, quoteIso, quoteName, quoteCountry)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)  
  `);

  fs.createReadStream(join(__dirname, 'pairs.csv'))
    .pipe(csv({ separator: ',' }))
    .on('data', (row) => {
      insertRow.run(
        null,
        row.pair,
        row.asset_class,
        row.base_iso,
        row.base_name,
        row.base_country,
        row.quote_iso,
        row.quote_name,
        row.quote_country
      );
    })
    .on('end', () => {
      console.log('CSV file successfully imported and table updated.');
      db.close();
      return;
    })
    .on('error', (err) => {
      console.error('Error processing CSV:', err);
      db.close();
      return;
    });
})(new Database(join(__dirname, DB_NAME)));
