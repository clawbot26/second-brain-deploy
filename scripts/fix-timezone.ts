// Fix timezone issue - update database records
import { neon } from '@neondatabase/serverless';

async function fixTimezoneIssue() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Delete incorrect 2026-02-14 records
  console.log('Deleting 2026-02-14 records...');
  await sql`DELETE FROM memories WHERE date = '2026-02-14'`;
  
  // Check if 2026-02-13 exists
  const existing = await sql`SELECT * FROM memories WHERE date = '2026-02-13'`;
  
  if (existing.length === 0) {
    console.log('No 2026-02-13 records found - will be created by sync script');
  } else {
    console.log(`Found ${existing.length} record(s) for 2026-02-13`);
  }
  
  console.log('✅ Database timezone fix complete');
}

fixTimezoneIssue().catch(console.error);
