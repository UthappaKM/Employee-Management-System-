# Testing Guide - Employee Management System with Secure Authentication

## System Overview
Your Employee Management System now has **admin-controlled employee account creation**. Public registration is disabled for security.

## Current System State
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB Atlas connected
- ✅ Public registration DISABLED
- ✅ Only admins can create employee accounts

---

## Step-by-Step Testing Guide

### Phase 1: Create Department (Required First)

1. **Login as Admin**
   - Go to: http://localhost:3000
   - Email: (your admin email)
   - Password: (your admin password)

2. **Create a Department**
   - Click "Departments" in navbar
   - Click "+ Add Department"
   - Fill in:
     - Department Name: `Software Testing`
     - Department Code: `ST-001`
     - Description: `Software Testing Department`
     - Department Head: Leave as "Select Department Head" (optional now)
     - Budget: `200000`
     - Location: `Bangalore`
     - Status: `Active`
   - Click "Create Department"
   - ✅ Department should be created successfully

---

### Phase 2: Create Employee WITH User Account

3. **Create Employee with Login Access**
   - Click "Employees" in navbar
   - Click "+ Add Employee"
   - Fill in **Personal Information**:
     - First Name: `John`
     - Last Name: `Doe`
     - Email: `john.doe@company.com`
     - Phone: `+1234567890`
     - Date of Birth: (any date)
   
   - Fill in **Employment Information**:
     - Position: `Software Developer`
     - Department: Select `Software Testing`
     - Date of Joining: Today's date
     - Salary: `75000`
     - Status: `Active`
   
   - Fill in **Address** (optional):
     - City: `Bangalore`
     - State: `Karnataka`
     - Country: `India`
   
   - **User Account Settings** (NEW SECTION!):
     - ☑️ **Create user account for login access** (checked by default)
     - User Role: Select `Employee`
     - Temporary Password: `Welcome@123` (or any password min 6 characters)
   
   - Click "Create Employee"
   - ✅ Alert will show: "Employee created successfully!" with login credentials
   - **NOTE DOWN THE PASSWORD!** (Welcome@123)

---

### Phase 3: Test Employee Login

4. **Logout from Admin Account**
   - Click "Logout" button

5. **Login as Employee**
   - Email: `john.doe@company.com`
   - Password: `Welcome@123`
   - Click "Login"
   - ✅ You should login successfully as employee

6. **Verify Employee Dashboard**
   - Should see "Welcome back, John!"
   - Should see **My Profile** section with:
     - ✅ Full Name: John Doe
     - ✅ Email: john.doe@company.com
     - ✅ Position: Software Developer
     - ✅ Department: Software Testing
     - ✅ Manager: Not assigned
     - ✅ Salary: $75,000
     - ✅ Status: Active badge
   - Should see **My Performance Reviews** section (empty for now)
   - Should see **Quick Statistics**:
     - Total Reviews: 0
     - Average Rating: N/A
     - Days Employed: (calculated)

7. **Verify Employee Can Only See Own Data**
   - Click "Employees" in navbar
   - Should see **"My Profile"** (not "Employees")
   - Should see ONLY John Doe's profile in the table
   - Should NOT see "Add Employee" button
   - Should NOT see employee statistics

---

### Phase 4: Create Manager Account

8. **Logout and Login as Admin Again**

9. **Create Another Employee as Manager**
   - Click "Employees" → "+ Add Employee"
   - Fill in details:
     - First Name: `Jane`
     - Last Name: `Smith`
     - Email: `jane.smith@company.com`
     - Position: `Team Lead`
     - Department: `Software Testing`
     - Salary: `95000`
   - **User Account Settings**:
     - ☑️ Create user account
     - User Role: Select **`Manager`** (important!)
     - Temporary Password: `Manager@123`
   - Click "Create Employee"

10. **Logout and Login as Manager**
    - Email: `jane.smith@company.com`
    - Password: `Manager@123`
    - ✅ Should login successfully

11. **Verify Manager Access**
    - Click "Dashboard"
      - ✅ Should see **company-wide statistics**:
        - Total Employees: 2
        - Active Employees: 2
        - Performance Overview
        - Department Distribution
    - Click "Employees"
      - ✅ Should see **ALL employees** (not just own profile)
      - ✅ Should see "Add Employee" button
      - ✅ Can Edit/Delete employees
    - Click "Departments"
      - ✅ Can view and manage departments
    - Click "Performance"
      - ✅ Can create and view performance reviews

---

### Phase 5: Test Registration Blocking

12. **Try to Register Publicly**
    - Logout from manager account
    - Go to: http://localhost:3000/register
    - ✅ Should see warning: "Public registration is disabled for security reasons"
    - ✅ Form should be disabled (grayed out)

13. **Try to Login Page**
    - Go to: http://localhost:3000/login
    - ✅ Should see: "Don't have an account? Contact your administrator to create one for you."
    - ✅ No "Register here" link

---

## Summary of User Roles

### Admin Role (Your account)
- ✅ Create, edit, delete employees
- ✅ Create user accounts for employees
- ✅ Create, edit, delete departments
- ✅ Create, edit, delete performance reviews
- ✅ View all statistics and data
- ✅ Manage all system settings

### Manager Role (Jane Smith)
- ✅ View all employees
- ✅ Create, edit, delete employees
- ✅ Create, edit, delete departments
- ✅ Create, edit, delete performance reviews
- ✅ View all statistics and data
- ❌ Cannot change system settings (if implemented)

### Employee Role (John Doe)
- ✅ View own profile only
- ✅ View own performance reviews only
- ✅ View own dashboard with personal stats
- ❌ Cannot see other employees
- ❌ Cannot see company statistics
- ❌ Cannot create/edit/delete anything
- ❌ Cannot see department management

---

## Expected Results

### ✅ Success Indicators:
1. Admin can create employees with user accounts
2. Created employees can login with temporary password
3. Employee sees only their own data
4. Manager sees all company data
5. Public registration is blocked
6. Dashboard shows correct data based on role

### ❌ If Something Fails:
- **Employee can't login**: Check if user account was created (checkbox was checked)
- **Employee sees all data**: Check if backend role filtering is working
- **Can still register publicly**: Check `.env` file has `ALLOW_PUBLIC_REGISTRATION=false`
- **"Server error" when creating employee**: Check backend console for errors

---

## Additional Features to Test

### Create Manager for Employee
1. Login as Admin
2. Go to Employee detail page (John Doe)
3. Click "Edit"
4. Select "Manager" field → Choose Jane Smith
5. Save
6. ✅ John Doe should now see "Manager: Jane Smith" in dashboard

### Create Performance Review
1. Login as Manager (Jane Smith)
2. Click "Performance" → "+ Add Review"
3. Select Employee: John Doe
4. Fill in review details
5. Save
6. Logout and login as John Doe
7. ✅ Should see the review in "My Performance Reviews"

---

## Security Features Verified

✅ **No Public Registration** - Users cannot self-register
✅ **Admin-Controlled Access** - Only admins create accounts
✅ **Role-Based Access Control** - Users see only what their role allows
✅ **Password Security** - Passwords are hashed in database
✅ **JWT Authentication** - Secure token-based login
✅ **Data Isolation** - Employees can't access other employees' data

---

## Next Steps After Testing

If everything works:
1. ✅ Create more employees and managers
2. ✅ Create more departments
3. ✅ Start creating performance reviews
4. ✅ Deploy to production (Heroku/Vercel/Railway)
5. ✅ Set up email notifications (future enhancement)
6. ✅ Add password reset functionality (future enhancement)
7. ✅ Force password change on first login (future enhancement)

---

## Troubleshooting

### Backend Issues
```bash
# Check backend console for errors
# Look for lines with [0] in terminal output
```

### Frontend Issues
```bash
# Check frontend console for errors
# Look for lines with [1] in terminal output
# Also check browser console (F12)
```

### Database Issues
```bash
# Check MongoDB Atlas connection
# Verify connection string in .env file
# Check if collections are created (users, employees, departments)
```

---

## Contact & Support

If you encounter any issues:
1. Check server console output
2. Check browser console (F12)
3. Verify .env configuration
4. Check MongoDB Atlas connection
5. Review SECURITY_FEATURES.md for detailed documentation

Happy Testing! 🎉
