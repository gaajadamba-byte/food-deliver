// CommonJS wrapper for Vercel when repository/package.json uses ESM
// Exports the Express `app` instance via module.exports.
// Lazy-load the ESM app and delegate requests to it. This avoids ESM/CJS
// import errors in the Vercel runtime. On first request we import the
// ES module (`src/index.js`) and cache the exported Express `app`.
let _appPromise = null;
function loadApp() {
  if (!_appPromise) {
    _appPromise = import("./src/index.js").then((m) =>
      m && m.default ? m.default : m,
    );
  }
  return _appPromise;
}

module.exports = async function handler(req, res) {
  const app = await loadApp();
  return app(req, res);
};
