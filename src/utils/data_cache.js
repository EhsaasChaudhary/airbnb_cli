import parseCSV from "./csv_parser.js";
import config from "../configs/config.js";
import ora from "ora";

let cachedData = null;

/**
 * Loads and caches Airbnb listing data at startup.
 * @returns {Promise<void>}
 */
async function preloadData() {
  const spinner = ora("Loading Airbnb data...").start();

  try {
     // uses parseCSV function from ../utils/csv_parser.js to read data from the CSV file by providing the file path from the config file
    cachedData = await parseCSV(config.DATA_FILE);
    spinner.succeed("Data loaded successfully!");
  } catch (error) {
    spinner.fail("Failed to load data.");
    console.error("Error:", error.message);
    cachedData = []; // Ensure it's an empty array if loading fails
  }
}

/**
 * Gets the cached Airbnb listing data.
 * @returns {Array} - Cached data.
 */
function getCachedData() {
  return cachedData;
}

export { preloadData, getCachedData };
