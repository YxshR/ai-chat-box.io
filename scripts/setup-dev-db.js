#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up development database...');

try {
  // Check if Prisma CLI is available
  try {
    execSync('npx prisma --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('Installing Prisma CLI...');
    execSync('npm install prisma @prisma/client', { stdio: 'inherit' });
  }

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema (creates SQLite file if it doesn't exist)
  console.log('🗄️  Setting up database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log('✅ Development database setup complete!');
  console.log('📝 You can now run: npm run dev');

} catch (error) {
  console.error('❌ Error setting up database:', error.message);
  console.log('💡 Try running these commands manually:');
  console.log('   npx prisma generate');
  console.log('   npx prisma db push');
  process.exit(1);
}