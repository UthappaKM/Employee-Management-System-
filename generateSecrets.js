/**
 * Generate Secure Secrets for Environment Variables
 * Run this script to generate secure random secrets
 * 
 * Usage: node generateSecrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 SECURE SECRETS GENERATOR\n');
console.log('='.repeat(60));

// Generate JWT Secret (64 characters hex)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('\nJWT_SECRET (copy this to your .env file):');
console.log(jwtSecret);

// Generate Additional Secrets
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');
console.log('\nREFRESH_TOKEN_SECRET (for future use):');
console.log(refreshTokenSecret);

// Generate Session Secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('\nSESSION_SECRET (for future use):');
console.log(sessionSecret);

console.log('\n' + '='.repeat(60));
console.log('\n⚠️  SECURITY WARNINGS:');
console.log('   - NEVER commit these secrets to Git');
console.log('   - Store them securely in your .env file');
console.log('   - Never share them publicly');
console.log('   - Regenerate if compromised');
console.log('\n✅ Copy the secrets above to your .env file\n');
