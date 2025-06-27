import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Enhanced database connection with retry logic for Cloud Run deployment
export async function initializeDatabase(maxRetries = 5, retryDelay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Test basic connectivity
      await pool.query('SELECT 1 as health_check');
      
      // Test schema access
      await pool.query('SELECT table_name FROM information_schema.tables LIMIT 1');
      
      console.log(`Database connection established successfully on attempt ${attempt}`);
      return true;
    } catch (error: any) {
      console.log(`Database connection attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      
      // Log more details for debugging in Cloud Run
      if (error.code) {
        console.log(`Error code: ${error.code}`);
      }
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to connect to database after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Exponential backoff for Cloud Run cold starts
      const backoffDelay = retryDelay * Math.pow(1.5, attempt - 1);
      console.log(`Waiting ${backoffDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
