#!/usr/bin/env node

import { Command } from "commander";
import readline from "readline";
import fs from "fs";
import path from "path";
import { preloadData } from "./src/utils/data_cache.js";  // Preload data
import listTopPricedAirbnb from "./src/services/top_listing.js";

const program = new Command();
const HISTORY_FILE = path.join(process.cwd(), "data/.airbnb_cli_history");

/**
 * Loads command history from a file if it exists.
 * @returns {Array} - Array of previous commands.
 */
function loadHistory() {
  try {
    return fs.existsSync(HISTORY_FILE)
      ? fs.readFileSync(HISTORY_FILE, "utf8").split("\n").filter(Boolean)
      : [];
  } catch (err) {
    console.error("Error loading history:", err);
    return [];
  }
}

program
  .name("airbnb-cli")
  .description("CLI tool for managing Airbnb listings")
  .version("1.0.0");

/**
 * Displays the main menu after data is ready.
 */
function showMenu() {
  console.log(`
Welcome to the Airbnb CLI!

Available commands:
  ptoplist <number>  - Show the top N highest-priced Airbnb listings

💡 Tip: Use UP/DOWN arrow keys to navigate commands.

Type a command to continue:
`);
}

/**
 * Prompts the user for a command input and executes the corresponding command.
 * Uses history for navigation but does NOT save new commands.
 */
function askForCommand() {
  const history = loadHistory();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    history: history,  // Load previous history
    historySize: 50,
    prompt: "> ",
  });

  rl.prompt();

  rl.on("line", (input) => {
    const args = input.trim().split(" ");
    if (args[0]) {
      try {
        program.parse(["node", "cli.js", ...args]);
      } catch (error) {
        console.error("Invalid command:", input);
      }
    }
    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Exiting Airbnb CLI. Have a great day!");
    process.exit(0);
  });
}

/**
 * Define CLI command to list top-priced Airbnb listings with an optional number argument.
 */
program
  .command("ptoplist [count]")
  .description("List top-priced Airbnb listings (default: 10)")
  .action((count) => {
    const numListings = parseInt(count, 10);
    if (isNaN(numListings) || numListings <= 0) {
      console.error("Error: Please enter a valid positive number.");
      return;
    }
    listTopPricedAirbnb(numListings);
  });

/**
 * Load data first, then show the menu and allow commands.
 */
(async function initializeCLI() {
  await preloadData(); // Load and cache data at startup
  showMenu();
  askForCommand();
})();
