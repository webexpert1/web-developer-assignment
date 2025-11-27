import sqlite3 from "sqlite3";
import config from "config";

/**
 * @fileoverview Manages the SQLite database connection using the `sqlite3` library.
 * It reads the database file path from the application configuration.
 */

/**
 * Retrieves the database path from the application configuration.
 * @type {string}
 */
const dbPath = config.get("dbPath") as string;
/**
 * The SQLite database connection instance.
 * This connection is used globally by the data access layer to execute queries.
 * @type {sqlite3.Database}
 */
export const connection = new sqlite3.Database(dbPath);
