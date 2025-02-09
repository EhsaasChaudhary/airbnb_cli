import fs from "fs";
import { parse } from "fast-csv";

/**
 * Parses a CSV file and extracts valid Airbnb listing data.
 *
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Array>} A promise that resolves to an array of valid listings.
 */

// uses fast-csv to parse the CSV file. The parseCSV function returns a promise that resolves to an array of valid listings.
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(parse({ headers: true, ignoreEmpty: true, trim: true }))
      .on("error", (error) => reject(`CSV Parsing Error: ${error.message}`))
      .on("data", (row) => {
        if (validateRow(row)) {
          results.push(row);
        }
      })
      .on("end", () => resolve(results));
  });
}

/**
 * Validates a row from the CSV file to ensure required fields are present.
 *
 * @param {Object} row - A row object from the CSV file.
 * @returns {boolean} True if the row contains required fields; otherwise, false.
 */
function validateRow(row) {
  return row.listing_id && row.date && row.available && row.price; // Ensure required fields exist
}

export default parseCSV;