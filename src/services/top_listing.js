import formatTable from "../utils/tabel_formatter.js";
import parseCSV from "../utils/csv_parser.js";
import config from "../configs/config.js"; // Import config file
import ora from "ora";

/**
 * Retrieves only the top N highest-priced Airbnb listings.
 * @param {number} count - Number of listings to return.
 */
async function getTopPriceListings(count) {
  try {
        // uses parseCSV function from ../utils/csv_parser.js to read data from the CSV file by providing the file path from the config file
    const priceListing = await parseCSV(config.DATA_FILE); // Read CSV file

    return priceListing
      .map((item) => ({
        ...item,
        price: parseFloat(item.price?.replace(/[$,]/g, "")),
      }))
      .filter((item) => !isNaN(item.price)) // Remove invalid prices
      .sort((a, b) => b.price - a.price)
      .slice(0, count); // Get top N listings
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
}

/**
 * Fetches and displays the top-priced Airbnb listings.
 * @param {number} count - Number of listings to display.
 */
async function listTopPricedAirbnb(count = 10) {
  const spinner = ora(`Fetching top ${count} Airbnb listings...`).start();

  try {
    const listings = await getTopPriceListings(count);
    spinner.succeed("Data loaded successfully!\n");

    if (!listings.length) {
      console.log("No listings found.");
    } else {
      console.log(formatTable(listings));
    }
  } catch (error) {
    spinner.fail("Failed to fetch data.");
    console.error("Error:", error.message);
  }
}

export default listTopPricedAirbnb;
