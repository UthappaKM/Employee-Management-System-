# Manager Cannot See Department Employees - FIXED

## Problem
Manager was logged in but could only see their own profile in the Employees section, not their department's employees.

## Root Cause
The User account had `role: "employee"` instead of `role: "manager"` in the database. The backend checks `req.user.role === 'manager'` to determine access, so it was treating the user as a regular employee.

## Solution Implemented

### 1. Created User Management System (Admin Only)
**New Backend Routes:** `backend/routes/users.js`
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)

**New Frontend Pages:**
- `client/src/pages/Users.js` - User management interface
- `client/src/pages/Users.css` - Styling for user management

**Route Added:** `client/src/App.js`
- `/users` - Admin-only route for user management

**Navigation Updated:** `client/src/components/Navbar.js`
- Added "Users" link in navbar (visible to Admin only)

### 2. How to Fix the Manager Issue

**Option 1: Use the New Users Page (EASIEST)**
1. Logout from the manager account
2. Login as Admin
3. Go to **Users** menu in the navbar
4. Find the user with email `manager1@emp.com`
5. Change their role from "Employee" to "Manager" using the dropdown
6. Logout and login as that user again
7. ✅ Manager will now see all employees in their department!

**Option 2: Use MongoDB Atlas**
1. Go to https://cloud.mongodb.com/
2. Browse Collections → `employee_management` → `users`
3. Find user with email `manager1@emp.com`
4. Edit document: Change `role: "employee"` to `role: "manager"`
5. Save and logout/login again

**Option 3: Run Update Script**
```bash
cd backend
node updateUserRole.js
```
(Make sure to edit the email in the script first)

### 3. Important Notes

**Understanding the Two Collections:**
- **Users Collection** - Stores authentication info (email, password, **role**)
  - Role determines what API endpoints can access
  - Controls middleware permissions (admin, hr, manager, employee)
  
- **Employees Collection** - Stores employee details (name, position, department)
  - Stores job-related information
  - Department field links to Departments collection

**The role MUST match:**
- If someone manages a department → User.role = "manager"
- If someone is in HR → User.role = "hr"
- If someone is an admin → User.role = "admin"
- Regular staff → User.role = "employee"

### 4. Testing After Fix

Once the role is updated to "manager":
1. Login as the manager
2. Go to Employees page
3. ✅ Should see all employees in their department
4. ✅ Should be able to create performance reviews
5. ✅ Should see department statistics on dashboard

### 5. Files Modified

**Backend:**
- `backend/routes/users.js` (NEW) - User management routes
- `backend/server.js` - Added /api/users route
- `backend/routes/employees.js` - Added debug logging
- `backend/updateUserRole.js` (NEW) - Script to update roles

**Frontend:**
- `client/src/pages/Users.js` (NEW) - User management page
- `client/src/pages/Users.css` (NEW) - Styling
- `client/src/App.js` - Added /users route
- `client/src/components/Navbar.js` - Added Users link

## Prevention

When creating new manager accounts:
1. Use "Add Employee" form
2. Set **User Role** to "Manager" (not "Employee")
3. Assign them a Department
4. They will automatically get manager permissions

## Current System Status
✅ Backend running on port 5000
✅ Frontend running on port 3001
✅ MongoDB Atlas connected
✅ User management system added
✅ Servers will auto-restart (nodemon watching for changes)
