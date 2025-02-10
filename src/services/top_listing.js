import formatTable from "../utils/tabel_formatter.js";
import { getCachedData } from "../utils/data_cache.js";
import ora from "ora";

/**
 * Retrieves only the top N highest-priced Airbnb listings.
 * @param {number} count - Number of listings to return.
 */
async function getTopPriceListings(count) {
  try {
    const priceListing = getCachedData(); // Get cached data

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
    spinner.succeed("Data Listing successful!\n");

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
