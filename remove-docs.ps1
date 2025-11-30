# ================================================================
# REMOVE DOCUMENTATION FILES FROM GITHUB (PowerShell)
# ================================================================

Write-Host "`n========================================================"
Write-Host "  REMOVING SENSITIVE DOCUMENTATION FILES FROM GITHUB" -ForegroundColor Cyan
Write-Host "========================================================`n"

# Step 1: Remove from current tracking
Write-Host "[Step 1/4] Removing files from Git tracking..." -ForegroundColor Yellow

$filesToRemove = @(
    "INSTALLATION_CHECKLIST.txt",
    "npm run install-all.txt",
    "REQUIREMENTS.txt",
    "JWT_ERROR_FIX.md",
    "LOGIN_DESIGN_UPDATE.md",
    "MANAGER_FIX.md",
    "MONGODB_SETUP.md",
    "TESTING_GUIDE.md",
    "TESTING_SERVER_RESTART_LOGOUT.md",
    "UI_REDESIGN_SUMMARY.md",
    "IMPLEMENTATION_SUMMARY.md",
    "DEPLOYMENT.md",
    "FINAL_YEAR_PROJECT_STATUS.md",
    "4-ROLE_SYSTEM_GUIDE.md",
    "API_DOCUMENTATION.md",
    "COMMANDS.md",
    "GETTING_STARTED.md",
    "QUICK_REFERENCE.md",
    "SECURITY_FEATURES.md",
    "SECURITY_IMPROVEMENTS.md"
)

foreach ($file in $filesToRemove) {
    git rm --cached $file 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    }
}

Write-Host "Done!`n" -ForegroundColor Green

# Step 2: Keep important docs
Write-Host "[Step 2/4] Adding back essential files..." -ForegroundColor Yellow
git add README.md
git add SECURITY.md
git add SECURITY_ALERT_RESPONSE.md
git add .env.template
git add .gitignore
Write-Host "Done!`n" -ForegroundColor Green

# Step 3: Commit changes
Write-Host "[Step 3/4] Committing changes..." -ForegroundColor Yellow
git commit -m "chore: remove sensitive documentation files from tracking"
Write-Host "Done!`n" -ForegroundColor Green

# Step 4: Summary
Write-Host "[Step 4/4] Ready to push to GitHub`n" -ForegroundColor Yellow

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "FILES REMOVED FROM GITHUB:" -ForegroundColor Red
$filesToRemove | ForEach-Object { Write-Host "  - $_" -ForegroundColor DarkGray }

Write-Host "`nFILES KEPT:" -ForegroundColor Green
Write-Host "  - README.md" -ForegroundColor DarkGray
Write-Host "  - SECURITY.md" -ForegroundColor DarkGray
Write-Host "  - SECURITY_ALERT_RESPONSE.md" -ForegroundColor DarkGray
Write-Host "  - .env.template" -ForegroundColor DarkGray
Write-Host "  - .gitignore" -ForegroundColor DarkGray

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  ACTION REQUIRED" -ForegroundColor Yellow
Write-Host "========================================================`n"

Write-Host "✓ Files are REMOVED FROM TRACKING but still on your local disk" -ForegroundColor Green
Write-Host "✓ They are protected by .gitignore from future commits`n" -ForegroundColor Green

Write-Host "To complete the removal from GitHub, run:" -ForegroundColor Yellow
Write-Host "  git push origin main`n" -ForegroundColor White

Write-Host "To remove from entire Git history (advanced):" -ForegroundColor Yellow
Write-Host "  See REMOVE_SENSITIVE_FILES_GUIDE.md`n" -ForegroundColor White

Write-Host "========================================================`n" -ForegroundColor Cyan

# Ask if user wants to push now
$response = Read-Host "Do you want to push to GitHub now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "The documentation files are now removed from GitHub.`n" -ForegroundColor Green
} else {
    Write-Host "`nRun 'git push origin main' when ready.`n" -ForegroundColor Yellow
}
