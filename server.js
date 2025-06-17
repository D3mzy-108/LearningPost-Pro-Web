// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Determine environment (development or production)
const dev = process.env.NODE_ENV !== "production";

// Hostname and Port provided by cPanel Node.js App environment
const hostname = "localhost"; // Usually 'localhost' is fine
const port = process.env.PORT || 3000; // cPanel will set process.env.PORT

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prepare the Next.js app
app.prepare().then(() => {
  // Create HTTP server
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl); // Let Next.js handle the request
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  })
    .once("error", (err) => {
      console.error("Failed to start server:", err);
      process.exit(1); // Exit if server fails to start
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}?devMode=${dev}`);
    });
});
