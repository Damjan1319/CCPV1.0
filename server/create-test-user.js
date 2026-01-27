import { initDatabase, createUser } from './database.js';
import { hashPassword } from './auth.js';

const TEST_EMAIL = 'test@ccp.com';
const TEST_PASSWORD = 'test1234';

async function createTestUser() {
  try {
    // Initialize database
    await initDatabase();

    // Hash password
    const passwordHash = await hashPassword(TEST_PASSWORD);

    // Create user
    const userId = await createUser(TEST_EMAIL, passwordHash);

    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', TEST_EMAIL);
    console.log('🔑 Password:', TEST_PASSWORD);
    console.log('👤 User ID:', userId);
    console.log('\nYou can now login with these credentials.');
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      console.log('ℹ️  Test user already exists!');
      console.log('📧 Email:', TEST_EMAIL);
      console.log('🔑 Password:', TEST_PASSWORD);
      console.log('\nYou can use these credentials to login.');
    } else {
      console.error('❌ Error creating test user:', error);
    }
  }
}

createTestUser();
