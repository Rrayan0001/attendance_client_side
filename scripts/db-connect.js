import postgres from 'postgres';
import readline from 'readline';

const connectionString = 'postgresql://neondb_owner:npg_lixbdvLD7OW5@ep-dawn-wildflower-adhz6523-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔗 Connected to Neon Database!');
console.log('📊 Available commands:');
console.log('  - students: Show all students');
console.log('  - attendance: Show attendance records');
console.log('  - stats: Show attendance statistics');
console.log('  - sql <query>: Run custom SQL query');
console.log('  - exit: Disconnect and exit');
console.log('');

async function handleCommand(input) {
  const command = input.trim().toLowerCase();
  
  try {
    switch (command) {
      case 'students':
        const students = await sql`SELECT * FROM students ORDER BY name`;
        console.log('\n📚 Students:');
        console.table(students);
        break;
        
      case 'attendance':
        const attendance = await sql`
          SELECT a.*, s.name as student_name 
          FROM attendance a 
          JOIN students s ON a.student_id = s.id 
          ORDER BY a.date DESC, s.name
        `;
        console.log('\n📅 Attendance Records:');
        console.table(attendance);
        break;
        
      case 'stats':
        const stats = await sql`
          SELECT 
            a.date,
            COUNT(*) as total_students,
            COUNT(CASE WHEN a.is_present THEN 1 END) as present_count,
            COUNT(CASE WHEN NOT a.is_present THEN 1 END) as absent_count,
            ROUND(
              (COUNT(CASE WHEN a.is_present THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
              2
            ) as attendance_percentage
          FROM attendance a
          GROUP BY a.date
          ORDER BY a.date DESC
        `;
        console.log('\n📊 Attendance Statistics:');
        console.table(stats);
        break;
        
      case 'exit':
        console.log('👋 Disconnecting...');
        await sql.end();
        process.exit(0);
        break;
        
      default:
        if (command.startsWith('sql ')) {
          const query = command.substring(4);
          const result = await sql.unsafe(query);
          console.log('\n🔍 Query Result:');
          console.table(result);
        } else {
          console.log('❌ Unknown command. Available: students, attendance, stats, sql <query>, exit');
        }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('');
  rl.question('💻 Enter command: ', handleCommand);
}

// Start the interactive session
rl.question('💻 Enter command: ', handleCommand);
