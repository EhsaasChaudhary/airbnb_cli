#!/usr/bin/env node

import { Command } from "commander";
import readline from "readline";
import fs from "fs";
import path from "path";
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

/**
 * Saves a command to history only if it executed successfully.
 * @param {string} command - Command to save.
 */
function saveHistory(command) {
  if (command.trim()) {
    fs.appendFileSync(HISTORY_FILE, command + "\n", "utf8");
  }
}

program
  .name("airbnb-cli")
  .description("CLI tool for managing Airbnb listings")
  .version("1.0.0");

/**
 * Displays the main menu with available commands.
 */
function showMenu() {
  console.log(`
Welcome to the Airbnb CLI!

Available commands:
  ptoplist <number>  - Show the top N highest-priced Airbnb listings

Type a command to continue:
`);
}

/**
 * Prompts the user for a command input and executes the corresponding command.
 * Supports command history with arrow key navigation.
 */
function askForCommand() {
  const history = loadHistory();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    history: history,
    historySize: 50,
    prompt: "> ",
  });

  rl.prompt();

  rl.on("line", (input) => {
    const args = input.trim().split(" ");
    if (args[0]) {
      try {
        program.parse(["node", "cli.js", ...args]);
        saveHistory(input); // Save command only if execution was successful
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
 * If no command is provided, show the menu and ask for user input.
 */
if (process.argv.length <= 2) {
  showMenu();
  askForCommand();
} else {
  try {
    program.parse();
    saveHistory(process.argv.slice(2).join(" ")); // Save only successful commands
  } catch (error) {
    console.error("Invalid command:", process.argv.slice(2).join(" "));
  }
}
