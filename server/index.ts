import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityHeaders, sanitizeInput, validateInput, requestLogger, rateLimit, errorHandler } from "./security";
import { db, initializeDatabase } from "./db";

// Environment variable validation
function validateEnvironment() {
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Generate SESSION_SECRET if not provided
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = require('crypto').randomBytes(32).toString('hex');
    log('Generated SESSION_SECRET automatically');
  }
}

// Validate environment on startup
validateEnvironment();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(rateLimit(1000, 5 * 60 * 1000)); // 1000 requests per 5 minutes
app.use(sanitizeInput);
app.use(validateInput);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

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

// Database connectivity check with enhanced retry logic
async function checkDatabaseConnection() {
  try {
    await initializeDatabase();
    return true;
  } catch (error: any) {
    log(`Database connection failed: ${error.message}`);
    throw new Error(`Unable to connect to database: ${error.message}`);
  }
}



(async () => {
  try {
    // Ensure database connection before starting server
    await checkDatabaseConnection();
    
    const server = await registerRoutes(app);

    // Use comprehensive error handler
    app.use(errorHandler);

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Use port from environment or default to 5000
    // Listen on 0.0.0.0 for Cloud Run compatibility
    const port = process.env.PORT || 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server running on 0.0.0.0:${port}`);
      log(`Health check available at http://0.0.0.0:${port}/health`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      log('SIGINT received, shutting down gracefully');
      server.close(() => {
        log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error: any) {
    log(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
})();
