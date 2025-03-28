import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

async function runMigration() {
  try {
    console.log('Adding createdBy column to expense table...');
    
    // SQL to add the createdBy column if it doesn't exist
    const migrationSQL = `
      ALTER TABLE expense
      ADD COLUMN IF NOT EXISTS "createdBy" varchar(255);
    `;
    
    console.log('Executing SQL migration...');
    const result = await sql(migrationSQL);
    console.log('Migration successful:', result);

    // Update existing expenses to use Budget.createdBy 
    const updateSQL = `
      UPDATE expense e
      SET "createdBy" = b."createdBy"
      FROM budget b
      WHERE e."budgetId" = b.id AND e."createdBy" IS NULL;
    `;

    console.log('Updating existing expenses...');
    const updateResult = await sql(updateSQL);
    console.log('Update successful:', updateResult);

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration(); 