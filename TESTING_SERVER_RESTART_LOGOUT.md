# Testing Server Restart Logout Feature

## Overview
This document explains how to test the server session tracking feature that forces users to logout when the server restarts.

## What Was Implemented
- Server session tracking using `serverStartTime` timestamp
- Token validation checks if token was issued before current server session
- Automatic logout when token is from previous server session

## How to Test

### Step 1: Start the Backend Server
```bash
cd backend
npm start
```
Wait for the message: "MongoDB Connected: ..." and "Server running on port 5000"

### Step 2: Start the Frontend
```bash
cd client
npm start
```
Wait for the browser to open at http://localhost:3001

### Step 3: Login to the Application
1. Navigate to http://localhost:3001/login
2. Enter valid credentials:
   - Email: Your registered email
   - Password: Your password
3. Click "Login"
4. Verify you are redirected to the dashboard
5. Note: You should see your name and role in the navbar

### Step 4: Verify You're Logged In
- Dashboard should display stats and data
- Navbar should show your name
- You can navigate to different pages (Employees, Departments, etc.)
- Token is stored in localStorage (you can verify in browser DevTools → Application → Local Storage)

### Step 5: Stop the Backend Server
1. Go to the terminal where backend is running
2. Press `Ctrl + C` to stop the server
3. Wait for the server to fully shut down
4. You should see "Server stopped" or similar message

### Step 6: Restart the Backend Server
```bash
npm start
```
**Important:** This creates a NEW server session with a NEW `serverStartTime`

### Step 7: Test the Force Logout
Now test in the browser WITHOUT refreshing yet:

1. **Option A: Refresh the browser page**
   - Press F5 or click refresh
   - The app will attempt to validate the token
   - You should be immediately redirected to /login
   - Check URL for `?error=session_expired` parameter

2. **Option B: Navigate to any protected page**
   - Try clicking on "Employees", "Departments", etc.
   - Any API call will fail with 401 error
   - You should be automatically logged out and redirected to login

3. **Option C: Check the browser console**
   - Open DevTools (F12)
   - Go to Console tab
   - You should see errors like:
     ```
     Token validation failed: Session expired due to server restart
     ```

## Expected Results

### ✅ What Should Happen
1. **Before server restart:** User is logged in and can access all pages
2. **During server restart:** User still appears logged in (token still in localStorage)
3. **After server restart + refresh:** User is immediately logged out
4. **Error message:** "Session expired due to server restart. Please login again."
5. **Redirect:** User is sent to /login page with error parameter
6. **Token cleared:** localStorage no longer contains the old token

### ❌ What Should NOT Happen
- User should NOT remain logged in after server restart + refresh
- User should NOT be able to access protected pages with old token
- Old tokens should NOT be valid after server restart

## Technical Details

### How It Works
1. **Server Start:**
   ```javascript
   // backend/utils/serverSession.js
   const serverStartTime = Date.now(); // e.g., 1704067200000
   ```

2. **Token Generation (Login):**
   ```javascript
   // JWT payload includes 'iat' (issued at) timestamp automatically
   {
     "id": "user123",
     "iat": 1704067250,  // Unix timestamp in seconds
     "exp": 1704153650   // Expires in 24 hours
   }
   ```

3. **Token Validation (After Restart):**
   ```javascript
   // backend/middleware/auth.js
   const decoded = jwt.verify(token, secret);
   
   // Check if token was issued before server started
   if (decoded.iat * 1000 < serverStartTime) {
     // Token is OLD - reject it
     return res.status(401).json({ 
       message: 'Session expired due to server restart'
     });
   }
   ```

4. **Frontend Response:**
   ```javascript
   // client/src/context/AuthContext.js
   if (!result.valid) {
     logout(); // Clear localStorage
     navigate('/login?error=session_expired');
   }
   ```

### Why This Works
- `decoded.iat` is the token's issue time (Unix timestamp in seconds)
- `serverStartTime` is when the current server instance started (milliseconds)
- We multiply `iat * 1000` to convert seconds to milliseconds
- If token was issued BEFORE server started, it's from a previous session
- Result: Old tokens are rejected, new tokens (issued after restart) are accepted

## Troubleshooting

### Problem: User stays logged in after restart
**Possible Causes:**
1. Frontend wasn't refreshed after server restart
2. Token validation isn't being called on app load
3. serverStartTime isn't being checked in middleware

**Solutions:**
1. Make sure to refresh the browser (F5) after server restart
2. Check AuthContext.js has the useEffect hook that calls validateToken()
3. Verify backend/middleware/auth.js has the serverStartTime check
4. Check browser console for error messages

### Problem: "Module not found: serverSession"
**Solution:**
Make sure `backend/utils/serverSession.js` exists and exports `serverStartTime`

### Problem: Still getting errors after logging in again
**Solution:**
After forced logout, you need to LOGIN AGAIN with your credentials. The old token is permanently invalid.

### Problem: Token validation endpoint returns 500 error
**Check:**
1. MongoDB is running and connected
2. User model is properly imported
3. JWT_SECRET is set in .env file

## Additional Testing Scenarios

### Test 1: Multiple Users
1. Login with User A
2. Open incognito window, login with User B
3. Restart server
4. Both users should be forced to logout on refresh

### Test 2: Token Expiration vs Server Restart
1. Login (token valid for 24 hours)
2. Wait 5 minutes
3. Restart server
4. Token should be invalid due to server restart (not expiration)

### Test 3: New Login After Restart
1. Restart server
2. Login with credentials
3. Token should work normally
4. Should stay logged in until next restart or 24h expiration

## Production Considerations

### For Production Deployment
1. **Multi-Server Setup:** If running multiple server instances (load balanced):
   - Each server has its own `serverStartTime`
   - Consider using Redis to share a global `serverStartTime`
   - OR use database-based session management instead

2. **Graceful Restarts:** If using PM2 or similar:
   - Set up proper restart policies
   - Consider implementing a "maintenance mode" flag
   - Notify users before forcing restart

3. **Monitoring:**
   - Log all forced logouts due to server restart
   - Track how many users were affected
   - Alert admins when server restarts occur

4. **User Experience:**
   - Show a more user-friendly error message
   - Consider sending email notifications about maintenance
   - Implement a "session timeout" warning before restart

## Conclusion
The server session tracking feature successfully forces users to re-authenticate after server restarts, addressing the security concern. This ensures that tokens from previous server sessions cannot be used, adding an extra layer of security to the application.
