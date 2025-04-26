const express = require("express");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { readdirSync, readFileSync } = fs;
const { join, parse } = path;

// Constants
const SERVER_PORT = process.env.PORT || 2030;
const PUBLIC_DIR = "/public";
const ASSETS_FILE = ".glitch-assets";
// Add any files that you'd like actually served up by this server, no tricks!!
const ACTUALLY_SERVE_FILENAMES_MATCHING = ["index.html", "door.html", "_draggable.js"];

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
let assetFiles = undefined;
/** @type ExtToFile */
let assetFilesByExt = undefined;

// Helper functions
function publicPath(path) {
  if (path) {
    return join(__dirname, PUBLIC_DIR, path);
  }

  return join(__dirname, PUBLIC_DIR);
}

function normalize(string) {
  return string.toLowerCase();
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function shouldIgnore(path) {
  const { ext } = parse(path);
  // Ignore any directories
  if (!ext) {
    return true;
  }

  return false;
}

function shouldActuallyServe(path) {
  const { base } = parse(path);
  if (path === "/" || ACTUALLY_SERVE_FILENAMES_MATCHING.includes(base)) {
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

function listGlitchAssets() {
  /** @type File[] */
  const filesList = [];
  try {
    const assetPath = join(__dirname, ASSETS_FILE);
    const glitchFiles = readFileSync(assetPath, { encoding: "utf-8" });
    glitchFiles
      .trim()
      .split("\n")
      .forEach((assetString) => {
        try {
          const asset = JSON.parse(assetString);
          if (asset.hasOwnProperty("name") && asset.hasOwnProperty("url")) {
            filesList.push({ name: asset.name, location: asset.url });
          }
        } catch (err) {
          // Ignore any errors parsing individual JSON elements
          console.error(
            `failed to parse glitch asset string "${assetString}" to json`,
            err
          );
        }
      });
  } catch (err) {
    console.error(`failed to list glitch assets from ${ASSETS_FILE}:`, err);
  }

  return filesList;
}

function sendAsset(res, location) {
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

// Handler for any Glitch assets, where the request is for
// the path "assets/filename.jpg"
app.use("/assets", (req, res, next) => {
  const { path } = req;
  if (shouldActuallyServe(path)) {
    next();
    return;
  }

  const { ext } = parse(path);
  const assetToSend = getRandomFile(
    decodeURI(path),
    assetFilesByExt[normalize(ext)]
  );
  if (assetToSend !== undefined) {
    console.log(`request for ${path} > 👻 > sending ${assetToSend.name}`);
    sendAsset(res, assetToSend.location);
  } else {
    console.warn(`request for ${path} > 👻 > sorry not found`);
    res.status(404);
    res.end();
  }
  return;
});

// Handler for any files in the "/public" folder, which usually
// includes js, css, html, and anything else not considered an asset
// and request matches the path "public/some-page.html"
app.use("/public", (req, res, next) => {
  const { path } = req;
  if (shouldActuallyServe(path)) {
    next();
    return;
  }

  const { ext } = parse(path);
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
    res.status(404);
    res.end();
  }
});

// Always serve the index file on "/"
app.get("/", (_req, res) => {
  res.sendFile(publicPath("index.html"));
});

// Getting to this wildcard route handler means that we
// actually want to serve the requested file
app.get("*", (req, res) => {
  const { base } = parse(req.path);
  // Check all the files in memory to see if there's a match
  const filesToCheck = [...assetFiles, ...publicFiles];
  const fileFound = filesToCheck.find((f) => f.name === base);
  if (fileFound) {
    if (fileFound.location.startsWith("https")) {
      sendAsset(res, fileFound.location);
      return;
    } else {
      res.sendFile(fileFound.location);
      return;
    }
  } else {
    console.warn(`request for ${path} > 👻 > sorry not found`);
    res.sendStatus(404);
    res.end();
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`* ~ * 👻 server running on ${SERVER_PORT} 👻 * ~ *`);
});

/**
 * The below code executes as soon as the server starts up
 * and makes a list of all the files in the `/public` directory
 * as well as CDN assets, stored in the `.glitch-assets` file
 */
// Get a list of files from /public directory
publicFiles = listPublicFiles();
// Map that file list by ext type for easy access
publicFilesByExt = mapFilesToExt(publicFiles);
// Get a list of files from glitch assets
assetFiles = listGlitchAssets();
// Map that file list by ext type for easy access
assetFilesByExt = mapFilesToExt(assetFiles);
