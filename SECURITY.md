# 🔒 Security Guidelines

## ⚠️ CRITICAL: Protecting Sensitive Information

### Environment Variables

**NEVER commit these files to Git:**
- `.env`
- Any file containing MongoDB connection strings
- Any file containing JWT secrets or API keys
- Configuration files with credentials

### Setting Up Environment Variables Securely

1. **Generate Secure Secrets**
   ```bash
   node generateSecrets.js
   ```

2. **Create Your .env File**
   ```bash
   cp .env.template .env
   ```

3. **Fill in Your Credentials**
   - MongoDB URI from MongoDB Atlas
   - JWT Secret from the generator
   - Never use example values in production

### What's Already Protected

✅ `.env` is in `.gitignore`
✅ `.env.example` uses placeholder values only
✅ `.env.template` provided for easy setup
✅ `generateSecrets.js` script for secure key generation

### MongoDB Atlas Security

1. **Connection String Security**
   - Never hardcode in source files
   - Store in `.env` file only
   - Use environment variables in code

2. **Network Access**
   - Whitelist specific IP addresses
   - Don't use 0.0.0.0/0 (allow all) in production
   - Update IP whitelist when deploying

3. **Database Users**
   - Create separate users with minimal permissions
   - Use strong passwords
   - Rotate credentials periodically

### Git Security

**Already Configured in `.gitignore`:**
```
.env
.env.local
.env.production
*.env
client/.env
backend/.env
```

**Before Committing:**
```bash
# Check what will be committed
git status

# Make sure .env is NOT listed
# If it appears, add it to .gitignore immediately
```

### If Credentials Are Exposed

**Immediate Actions:**

1. **Rotate MongoDB Credentials**
   - Go to MongoDB Atlas
   - Database Access → Edit User → Reset Password
   - Update MONGO_URI in `.env`

2. **Regenerate JWT Secret**
   ```bash
   node generateSecrets.js
   ```
   - Copy new JWT_SECRET to `.env`
   - All users will need to re-login

3. **Remove from Git History**
   ```bash
   # Install BFG Repo-Cleaner
   # https://rtyley.github.io/bfg-repo-cleaner/
   
   # Remove sensitive file
   bfg --delete-files .env
   
   # Or use git filter-branch (more complex)
   ```

4. **Force Push (if necessary)**
   ```bash
   git push --force
   ```
   ⚠️ Coordinate with team before force pushing

### Best Practices

1. **Development**
   - Use different credentials for dev/staging/prod
   - Never use production credentials locally
   - Test with dummy data

2. **Deployment**
   - Use platform environment variables (Heroku, Vercel, etc.)
   - Never commit deployment configs with secrets
   - Use secrets management services

3. **Team Collaboration**
   - Share credentials securely (1Password, LastPass)
   - Don't send credentials via email/chat
   - Document who has access to what

4. **Code Review**
   - Check for hardcoded credentials
   - Verify .env is in .gitignore
   - Ensure no secrets in comments

### Monitoring

**Check for Leaks:**
- GitHub: Enable secret scanning
- GitGuardian: Monitors for leaked secrets
- Review commits before pushing

### Emergency Contacts

If you've accidentally committed secrets:

1. Contact your team lead immediately
2. Rotate all compromised credentials
3. Review access logs for suspicious activity
4. Document the incident

### Additional Resources

- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [MongoDB Atlas Security](https://docs.atlas.mongodb.com/security/)

---

**Remember: Security is everyone's responsibility!**
