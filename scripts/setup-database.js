#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Setting up database...');

try {
  // Change to the ai-chat directory
  process.chdir(path.join(__dirname, '..'));
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🗄️  Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('🚀 Running database migrations...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Database setup complete!');
  console.log('');
  console.log('🎉 Your AI chat application is ready!');
  console.log('');
  console.log('To start the development server:');
  console.log('  cd ai-chat');
  console.log('  npm run dev');
  console.log('');
  console.log('Features configured:');
  console.log('  ✅ Gemini AI integration');
  console.log('  ✅ Google OAuth authentication');
  console.log('  ✅ Rate limiting (3 messages/day for anonymous users)');
  console.log('  ✅ Unlimited messages for authenticated users');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}