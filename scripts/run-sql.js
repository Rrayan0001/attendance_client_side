import postgres from 'postgres';

const connectionString = 'postgresql://neondb_owner:npg_lixbdvLD7OW5@ep-dawn-wildflower-adhz6523-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

async function runQuery() {
  try {
    console.log('🔗 Connected to Neon Database!');
    
    // Get the query from command line arguments
    const query = process.argv.slice(2).join(' ');
    
    if (!query) {
      console.log('📊 Available quick queries:');
      console.log('  npm run sql "SELECT * FROM students"');
      console.log('  npm run sql "SELECT * FROM attendance"');
      console.log('  npm run sql "SELECT COUNT(*) FROM students"');
      console.log('');
      console.log('Or use the interactive mode: npm run db');
      return;
    }
    
    console.log(`🔍 Running: ${query}`);
    const result = await sql.unsafe(query);
    
    if (result.length === 0) {
      console.log('✅ Query executed successfully (no results)');
    } else {
      console.log('\n📊 Results:');
      console.table(result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

runQuery();
