import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityHeaders, sanitizeInput, validateInput, requestLogger, rateLimit, errorHandler } from "./security";
import { db, initializeDatabase, pool } from "./db";

// Environment variable validation with enhanced error handling
function validateEnvironment() {
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    log(`❌ Missing required environment variables: ${missingVars.join(', ')}`, 'startup');
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Generate SESSION_SECRET if not provided
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = require('crypto').randomBytes(32).toString('hex');
    log('✅ Generated SESSION_SECRET automatically', 'startup');
  }
  
  // Log environment status
  log(`✅ Environment validation passed`, 'startup');
  log(`📊 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`, 'startup');
  log(`🚀 PORT: ${process.env.PORT || 'not set (using default 5000)'}`, 'startup');
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
    log('🔍 Checking database connection...', 'startup');
    await initializeDatabase();
    log('✅ Database connection established successfully', 'startup');
    return true;
  } catch (error: any) {
    log(`❌ Database connection failed: ${error.message}`, 'startup');
    throw new Error(`Unable to connect to database: ${error.message}`);
  }
}



(async () => {
  try {
    log('🚀 Starting application server...', 'startup');
    
    // Ensure database connection before starting server
    await checkDatabaseConnection();
    
    log('📡 Registering API routes...', 'startup');
    const server = await registerRoutes(app);

    // Use comprehensive error handler
    app.use(errorHandler);

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      log('🛠️ Setting up Vite development server...', 'startup');
      await setupVite(app, server);
    } else {
      log('📦 Serving static files for production...', 'startup');
      serveStatic(app);
    }

    // Use port from environment or default to 5000
    // Listen on 0.0.0.0 for Cloud Run compatibility
    const port = parseInt(process.env.PORT || '5000', 10);
    
    server.listen(port, '0.0.0.0', () => {
      log(`✅ Server running on 0.0.0.0:${port}`, 'startup');
      log(`🔍 Health check available at http://0.0.0.0:${port}/health`, 'startup');
      log(`🌐 Application ready for deployment`, 'startup');
    });

    // Enhanced graceful shutdown handling for Cloud Run
    const gracefulShutdown = (signal: string) => {
      log(`${signal} received, shutting down gracefully`, 'shutdown');
      
      server.close((err) => {
        if (err) {
          log(`Error during shutdown: ${err.message}`, 'shutdown');
          process.exit(1);
        }
        
        log('Server closed successfully', 'shutdown');
        
        // Close database connections
        if (pool) {
          pool.end().then(() => {
            log('Database connections closed', 'shutdown');
            process.exit(0);
          }).catch((err: any) => {
            log(`Error closing database: ${err.message}`, 'shutdown');
            process.exit(1);
          });
        } else {
          process.exit(0);
        }
      });
      
      // Force shutdown after 30 seconds
      setTimeout(() => {
        log('Force shutdown after timeout', 'shutdown');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error: any) {
    log(`❌ Failed to start server: ${error.message}`, 'startup');
    console.error('Full error details:', error);
    process.exit(1);
  }
})();
