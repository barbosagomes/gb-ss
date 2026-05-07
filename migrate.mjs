import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:dRdUwIkTZLudTBVIeuftBlFFGNDyeJfN@mysql.railway.internal:3306/railway';
  
  console.log('[Migration] Connecting to database...');
  
  let connection;
  try {
    connection = await mysql.createConnection(dbUrl);
    console.log('[Migration] Connected successfully');
    
    // Check if users table exists
    const [rows] = await connection.query("SHOW TABLES LIKE 'users'");
    if (Array.isArray(rows) && rows.length > 0) {
      console.log('[Migration] Tables already exist, skipping migration');
      await connection.end();
      return;
    }
    
    // Read and execute init.sql
    const sqlPath = path.join(__dirname, 'drizzle', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split by statement and execute each
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    for (const stmt of statements) {
      try {
        await connection.query(stmt + ';');
      } catch (err) {
        // Ignore "table already exists" errors
        if (!err.message.includes('already exists')) {
          console.warn('[Migration] Warning:', err.message);
        }
      }
    }
    
    console.log('[Migration] All tables created successfully');
    await connection.end();
  } catch (error) {
    console.error('[Migration] Failed:', error.message);
    if (connection) await connection.end();
    // Don't exit - let the server start anyway
  }
}

migrate();
