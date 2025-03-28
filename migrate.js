import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './utils/schema.jsx';
import { readFile } from 'fs/promises';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql }, { schema });

async function runMigration() {
  try {
    console.log('Reading migration file...');
    // Read SQL file manually and execute it
    const migrationPath = join(process.cwd(), 'drizzle', '0000_free_squirrel_girl.sql');
    const migrationSQL = await readFile(migrationPath, 'utf8');
    
    console.log('Executing SQL migration...');
    console.log('SQL:', migrationSQL);
    
    const result = await sql(migrationSQL);
    console.log('Migration successful:', result);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration(); 