@echo off
REM ================================================================
REM REMOVE DOCUMENTATION FILES FROM GITHUB
REM ================================================================
echo.
echo ========================================================
echo   REMOVING SENSITIVE DOCUMENTATION FILES FROM GITHUB
echo ========================================================
echo.

REM Step 1: Remove from current tracking
echo [Step 1/4] Removing files from Git tracking...
git rm --cached INSTALLATION_CHECKLIST.txt 2>nul
git rm --cached "npm run install-all.txt" 2>nul
git rm --cached REQUIREMENTS.txt 2>nul
git rm --cached JWT_ERROR_FIX.md 2>nul
git rm --cached LOGIN_DESIGN_UPDATE.md 2>nul
git rm --cached MANAGER_FIX.md 2>nul
git rm --cached MONGODB_SETUP.md 2>nul
git rm --cached TESTING_GUIDE.md 2>nul
git rm --cached TESTING_SERVER_RESTART_LOGOUT.md 2>nul
git rm --cached UI_REDESIGN_SUMMARY.md 2>nul
git rm --cached IMPLEMENTATION_SUMMARY.md 2>nul
git rm --cached DEPLOYMENT.md 2>nul
git rm --cached FINAL_YEAR_PROJECT_STATUS.md 2>nul
git rm --cached 4-ROLE_SYSTEM_GUIDE.md 2>nul
git rm --cached API_DOCUMENTATION.md 2>nul
git rm --cached COMMANDS.md 2>nul
git rm --cached GETTING_STARTED.md 2>nul
git rm --cached QUICK_REFERENCE.md 2>nul
git rm --cached SECURITY_FEATURES.md 2>nul
git rm --cached SECURITY_IMPROVEMENTS.md 2>nul

echo Done!
echo.

REM Step 2: Keep important docs
echo [Step 2/4] Adding back essential files...
git add README.md
git add SECURITY.md
git add SECURITY_ALERT_RESPONSE.md
git add .env.template
git add .gitignore

echo Done!
echo.

REM Step 3: Commit changes
echo [Step 3/4] Committing changes...
git commit -m "chore: remove sensitive documentation files from tracking"

echo Done!
echo.

REM Step 4: Show what will be pushed
echo [Step 4/4] Ready to push to GitHub
echo.
echo FILES THAT WILL BE REMOVED FROM GITHUB:
echo - All documentation .md files (except README.md, SECURITY.md)
echo - All .txt files
echo.
echo FILES THAT WILL BE KEPT:
echo - README.md
echo - SECURITY.md
echo - SECURITY_ALERT_RESPONSE.md
echo - .env.template
echo - .gitignore
echo.
echo ========================================================
echo   ACTION REQUIRED
echo ========================================================
echo.
echo These files are REMOVED FROM TRACKING but still on your local disk.
echo They are protected by .gitignore from future commits.
echo.
echo To complete the removal from GitHub, run:
echo    git push origin main
echo.
echo To remove from entire Git history (advanced):
echo    See REMOVE_SENSITIVE_FILES_GUIDE.md
echo.
echo ========================================================
pause
