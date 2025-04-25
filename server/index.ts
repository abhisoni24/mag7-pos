import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Middleware to log API requests and responses.
 *
 * This middleware logs the HTTP method, path, status code, and response time
 * for API requests. If the response is JSON, it also logs the response body.
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * Main application entry point.
 *
 * This function initializes the Express application, registers routes,
 * sets up error handling, and starts the server. In development mode,
 * it also sets up Vite for hot module reloading.
 */
(async () => {
  // Register application routes
  const server = await registerRoutes(app);

  /**
   * Global error-handling middleware.
   *
   * This middleware catches errors thrown in the application and sends
   * a JSON response with the error status and message.
   *
   * @param err - The error object.
   * @param _req - The Express request object (unused).
   * @param res - The Express response object.
   * @param _next - The next middleware function (unused).
   */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  /**
   * Setup Vite for development or serve static files for production.
   *
   * In development mode, Vite is used for hot module reloading.
   * In production mode, static files are served.
   */
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  /**
   * Start the server.
   *
   * The server listens on the port specified in the environment variable `PORT`,
   * or defaults to port 5000. It binds to all network interfaces (host: "0.0.0.0").
   */
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
