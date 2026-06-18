// Wrapper for Vercel: export the Express `app` instance.
// Attempts to require compiled JS first, falls back to TS module if available.
let app;
try {
  const mod = require("./src/index.js");
  app = mod && mod.default ? mod.default : mod;
} catch (e) {
  // If runtime can require TS directly (some environments), try that.
  const mod = require("./src/index.ts");
  app = mod && mod.default ? mod.default : mod;
}

module.exports = app;
