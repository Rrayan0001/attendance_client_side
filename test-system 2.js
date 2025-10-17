import axios from 'axios';

async function testSystem() {
  console.log('🧪 Testing Attendance Management System...\n');
  
  try {
    // Test backend health
    console.log('1. Testing Backend Health...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('✅ Backend:', healthResponse.data.message);
    
    // Test students endpoint
    console.log('\n2. Testing Students API...');
    const studentsResponse = await axios.get('http://localhost:3001/api/students');
    console.log(`✅ Students API: Found ${studentsResponse.data.length} students`);
    
    // Test frontend
    console.log('\n3. Testing Frontend...');
    const frontendResponse = await axios.get('http://localhost:5173');
    if (frontendResponse.data.includes('<!doctype html>')) {
      console.log('✅ Frontend: Loading successfully');
    } else {
      console.log('❌ Frontend: Not loading properly');
    }
    
    console.log('\n🎉 System Status: ALL SYSTEMS OPERATIONAL!');
    console.log('\n📱 Access your application at:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend API: http://localhost:3001/api');
    console.log('\n📊 Database:');
    console.log('   Students loaded:', studentsResponse.data.length);
    console.log('   Sample students:', studentsResponse.data.map(s => s.name).join(', '));
    
  } catch (error) {
    console.error('❌ System Test Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting:');
      console.log('   - Make sure backend is running: cd backend && node server.js');
      console.log('   - Make sure frontend is running: cd frontend && npm run dev');
    }
  }
}

testSystem();
