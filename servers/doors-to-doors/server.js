const express = require("express");
const fs = require("fs");
const path = require("path");
const { readdirSync, readFileSync } = fs;
const { join, parse } = path;

// Constants
const SERVER_PORT = process.env.PORT || 2030;
// Set this variable if there is a list of CDN files on disk
const CDN_ASSETS_FILE = "";
// This is where files will be listed and cached for responses
const PUBLIC_DIR = "public";
// Add any files that you'd like actually served up by this server, no tricks!!
const ACTUALLY_SERVE_FILENAMES_MATCHING = new Set(["index.html", "door.html", "_draggable.js"]);

/**
 * @typedef File
 * @property {string} name - The base filename with extension
 * @property {string} location - The path of the file, either a Glitch CDN link or path relative to the root project directory
 *
 * @typedef ExtToFile
 * @type {Object.<string, File[]>}
 */

// In-memory store
/** @type File[] */
let publicFiles = undefined;
/** @type ExtToFile */
let publicFilesByExt = undefined;
/** @type File[] */
let cdnFiles = undefined;
/** @type ExtToFile */
let cdnFilesByExt = undefined;

// Helper functions
/**
 * PublicPath returns the full path on disk the PUBLIC_DIR directory
 * or a file in the PUBLIC_DIR directory
 * @param {string?} path The location of public file
 * @returns {string} fullPath The full path to file
 */
function publicPath(path) {
  if (path) {
    return join(__dirname, PUBLIC_DIR, path);
  }

  return join(__dirname, PUBLIC_DIR);
}

/**
 * @param {string} string 
 * @returns {string}
 */
function normalize(string) {
  return string.toLowerCase();
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function shouldIgnore(path) {
  const { ext } = parse(path);
  // Ignore any directories
  if (!ext) {
    return true;
  }

  return false;
}

/**
 * ShouldActuallyServe checks the path filename against a list of
 * assets it should serve without any tricks
 * @param {string} path 
 * @returns {boolean}
 */
function shouldActuallyServe(path) {
  const { base } = parse(path);
  if (path === "/" || ACTUALLY_SERVE_FILENAMES_MATCHING.has(base)) {
    return true;
  }

  return false;
}

function mapFilesToExt(files) {
  /** @type ExtensionItemMap */
  const extMap = {};
  // Create a map of extensions to filenames
  files.forEach((item) => {
    const { ext } = parse(item.name);
    const e = normalize(ext);
    if (!extMap.hasOwnProperty(e)) {
      extMap[e] = [];
    }
    extMap[e].push(item);
  });

  return extMap;
}

/**
 * Looks up a random file from the supplied list,
 * with a max number of tries in case there aren't
 * enough files to select a random other one.
 * @param {string} path
 * @param {File[]} list
 * @returns {File|undefined}
 */
function getRandomFile(path, list) {
  if (!list || list.length === 0) {
    return;
  }

  const { name: oldName, ext } = parse(path);
  let tries = 0;
  let selectedName = oldName;
  let selectedPath = "";

  while (tries <= 10 && selectedName === oldName) {
    const randomIndex = random(0, list.length - 1);
    const selectedFile = list[randomIndex];
    if (selectedFile) {
      const { name: newName } = parse(selectedFile.name);
      selectedName = newName;
      selectedPath = selectedFile.location;
    }
    tries++;
  }

  return { name: `${selectedName}${ext}`, location: selectedPath };
}

/**
 * ListPublicFiles lists all files in PUBLIC_DIR directory
 * and returns a list of their names and paths.
 * @returns {File[]} fileList
 */
function listPublicFiles() {
  try {
    const publicDir = publicPath();
    const files = readdirSync(publicDir, {
      encoding: "utf-8",
      recursive: true,
    });
    return files
      .filter((f) => !shouldIgnore(f))
      .map((f) => ({ name: f, location: publicPath(f) }));
  } catch (err) {
    console.error(`failed to list files from ${PUBLIC_DIR}:`, err);
    return [];
  }
}
/**
 * Reads a json file on disk if ASSETS_FILE is set.
 * The structure of this file should be a newline separated
 * list of JSON objects with "name" and "url" fields.
 * @returns {File[]} fileList
 */
function listCDNFiles() {
  /** @type File[] */
  const fileList = [];
  if (!CDN_ASSETS_FILE) {
    return fileList
  }

  try {
    const assetPath = join(__dirname, CDN_ASSETS_FILE);
    const assetFiles = readFileSync(assetPath, { encoding: "utf-8" });
    assetFiles
      .trim()
      .split("\n")
      .forEach((assetString) => {
        try {
          const asset = JSON.parse(assetString);
          if (asset.hasOwnProperty("name") && asset.hasOwnProperty("url")) {
            fileList.push({ name: asset.name, location: asset.url });
          }
        } catch (err) {
          // Ignore any errors parsing individual JSON elements
          console.error(
            `failed to parse asset string "${assetString}" to json`,
            err
          );
        }
      });
  } catch (err) {
    console.error(`failed to list assets from ${CDN_ASSETS_FILE}:`, err);
  }

  return fileList;
}

function redirectToLocation(res, location) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.redirect(location);
}

// Server and request handlers
const app = express();

// Middleware to label each incoming request with whether the file
// should be faithfully served
app.use((req, _res, next) => {
  const { base } = parse(req.path);
  if (shouldActuallyServe(base)) {
    req.shouldActuallyServe = true;
  } else {
    req.shouldActuallyServe = false;
  }
  next();
})

// Middleware for any assets served through a CDN, where the request for
// an asset with the path "cdn/filename.jpg" is redirected to
// the appropriate (or not appropriate ;)) resource
app.use("/cdn", (req, res, next) => {
  const { path } = req;
  if (req.shouldActuallyServe) {
    next();
    return;
  }

  const { ext } = parse(path);
  const assetToSend = getRandomFile(
    decodeURI(path),
    cdnFilesByExt[normalize(ext)]
  );
  if (assetToSend !== undefined) {
    console.log(`request for ${path} > 👻 > sending ${assetToSend.name}`);
    redirectToLocation(res, assetToSend.location);
  } else {
    console.warn(`request for ${path} > 👻 > sorry not found`);
    res.sendStatus(404);
  }
  return;
});

// Always serve the index file on "/"
app.get("/", (_req, res) => {
  res.sendFile(publicPath("index.html"));
});

// Getting to this wildcard route handler means that we
// actually want to serve the requested file
app.get("*", (req, res) => {
  const { shouldActuallyServe, path } = req;
  const { base, ext } = parse(path);
  if (shouldActuallyServe) {
    // TODO: Optimize for performance here
    // Check all the files in memory to see if there's a match
    const filesToCheck = [...cdnFiles, ...publicFiles];
    const fileFound = filesToCheck.find((f) => f.name === base);
    if (fileFound) {
      if (fileFound.location.startsWith("https")) {
        redirectToLocation(res, fileFound.location);
        return;
      } else {
        res.sendFile(fileFound.location);
        return;
      }
    } else {
      console.warn(`request for ${path} > 👻 > sorry not found`);
      res.sendStatus(404);
      return;
    }
  }

  const fileToSend = getRandomFile(
    decodeURI(path),
    publicFilesByExt[normalize(ext)]
  );

  if (fileToSend !== undefined) {
    console.log(`request for ${path} > 👻 > sending ${fileToSend.name}`);
    res.sendFile(fileToSend.location);
    return;
  } else {
    console.warn(`request for ${path} > 👻 > sorry not found`);
    res.sendStatus(404);
    return;
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`* ~ * 👻 server running on ${SERVER_PORT} 👻 * ~ *`);
});

/**
 * The below code executes as soon as the server starts up
 * and makes a list of all the files in the public directory
 * as well as any assets listed in a static file
 */
// Get a list of files from /public directory
publicFiles = listPublicFiles();
// Map that file list by ext type for easy access
publicFilesByExt = mapFilesToExt(publicFiles);
// Get a list of files from CDN assets list
cdnFiles = listCDNFiles();
// Map that file list by ext type for easy access
cdnFilesByExt = mapFilesToExt(cdnFiles);
