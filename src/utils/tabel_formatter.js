import Table from "cli-table3";
import chalk from "chalk";

/**
 * Dynamically formats an array of objects into a CLI table.
 * Adds a column number, supports automatic column detection, colored headers, and formatting for boolean values.
 *
 * @param {Array<Object>} data - Array of objects to format as a table.
 * @returns {string} - Formatted table as a string.
 */
function formatTable(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return "No data available.";
  }

  // Extract column headers dynamically
  const headers = ["#", ...Object.keys(data[0])]; // Add index column

  // Define column widths dynamically based on longest value or header
  const colWidths = headers.map((key, index) =>
    Math.max(
      key.length,
      ...data.map((row, rowIndex) =>
        String(index === 0 ? rowIndex + 1 : row[key] ?? "").length
      )
    ) + 2
  );

  // Apply colors to headers dynamically
  const colors = [chalk.blue, chalk.green, chalk.yellow, chalk.cyan, chalk.magenta];
  const coloredHeaders = headers.map((header, index) => colors[index % colors.length](header));

  const table = new Table({
    head: coloredHeaders,
    colWidths,
  });

  // Populate table rows with index numbers
  data.forEach((row, rowIndex) => {
    table.push([chalk.gray(rowIndex + 1), ...headers.slice(1).map((header) => formatValue(row[header]))]);
  });

  return table.toString();
}

/**
 * Formats a value for table display.
 * - Booleans are shown as "Yes" (green) or "No" (red).
 * - Undefined/null values are replaced with "N/A" (gray).
 * - Other values are kept as strings.
 *
 * @param {*} value - The value to format.
 * @returns {string} - The formatted string with applied colors.
 */
function formatValue(value) {
  if (value === "t" || value === true || value === 1) return chalk.green("Yes");
  if (value === "f" || value === false || value === 0) return chalk.red("No");
  if (value == null || value === undefined) return chalk.gray("N/A");
  return chalk.white(value);
}

export default formatTable;
