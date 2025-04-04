import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../../utils/schema.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });
    
    const migrationPath = join(process.cwd(), 'drizzle', '0000_free_squirrel_girl.sql');
    const migrationSQL = await readFile(migrationPath, 'utf8');
    
    await sql(migrationSQL);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Migration completed successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
