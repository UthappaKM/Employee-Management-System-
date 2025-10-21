# Quick Start Guide - Employee Management System

## 🚀 Installation Steps

### Step 1: Install Dependencies

Open Command Prompt in the project root directory and run:

```cmd
npm install
```

Then install frontend dependencies:

```cmd
cd client
npm install
cd ..
```

Or use the convenient command to install both at once:

```cmd
npm run install-all
```

### Step 2: Set Up MongoDB Atlas

1. Follow the detailed guide in `MONGODB_SETUP.md`
2. Create a free MongoDB Atlas account
3. Create a cluster and get your connection string
4. Whitelist your IP address (0.0.0.0/0 for development)

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```cmd
   copy .env.example .env
   ```

2. Open `.env` and update with your values:
   ```env
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/employee_management?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

### Step 4: Start the Application

**Option A: Run Both Frontend and Backend Together**
```cmd
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```cmd
npm run server
```

Terminal 2 (Frontend):
```cmd
npm run client
```

**Option C: Production Mode**
```cmd
npm start
```

### Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 👤 First Time Setup

### Create Your First Admin User

1. Open http://localhost:3000
2. Click "Register here"
3. Fill in the registration form:
   - Name: Your Name
   - Email: your.email@example.com
   - Password: (at least 6 characters)
   - Role: **Select "Admin"**
4. Click "Register"

You'll be automatically logged in and redirected to the dashboard.

---

## 📋 How to Use the System

### 1. Dashboard
- View employee statistics
- See active, inactive, and on-leave employees
- Monitor performance overview (Admin/Manager only)
- View department distribution

### 2. Managing Departments (Admin/Manager Only)

**Create a Department:**
1. Go to "Departments" from the navigation menu
2. Click "+ Add Department"
3. Fill in:
   - Department Name (e.g., "Engineering", "Sales")
   - Department Code (e.g., "ENG", "SAL")
   - Description (optional)
   - Department Head (optional - select from employees)
   - Budget (optional)
   - Location (optional)
   - Status (Active/Inactive)
4. Click "Create Department"

**Sample Departments to Create:**
- IT Department (Code: IT)
- Human Resources (Code: HR)
- Sales (Code: SAL)
- Marketing (Code: MKT)
- Finance (Code: FIN)

### 3. Managing Employees (Admin/Manager Only)

**Add an Employee:**
1. Go to "Employees" from the navigation menu
2. Click "+ Add Employee"
3. Fill in the Personal Information:
   - First Name
   - Last Name
   - Email (must be unique)
   - Phone
   - Date of Birth
4. Fill in Employment Information:
   - Position (e.g., "Software Engineer")
   - Department (select from dropdown)
   - Date of Joining
   - Salary
   - Status (Active/Inactive/On Leave/Terminated)
5. Fill in Address (optional)
6. Click "Create Employee"

**Edit Employee:**
1. Go to "Employees"
2. Click "Edit" button next to the employee
3. Update information
4. Click "Update Employee"

**View Employee Details:**
1. Click "View" button next to any employee
2. See complete profile and performance history

**Filter and Search Employees:**
- Use the search box to find by name or email
- Filter by status (Active, Inactive, On Leave, Terminated)
- Filter by department

### 4. Performance Management (Admin/Manager Only)

**Create a Performance Review:**
1. Go to "Performance" from the navigation menu
2. Click "+ Create Review"
3. Fill in:
   - Employee (select from dropdown)
   - Review Period (start and end dates)
   - Overall Rating (1-5 stars)
   - Categories with ratings and comments:
     - Technical Skills
     - Communication
     - Leadership
     - Teamwork
     - Problem Solving
   - Strengths (list employee's strengths)
   - Areas for Improvement
   - Goals for next period
   - Achievements
   - General Comments
   - Status (Draft/Submitted/Reviewed/Acknowledged)
4. Click "Create Review"

**View Performance Reviews:**
- See all reviews in a table format
- Filter by employee or status
- View average ratings and statistics

---

## 🎯 Common Tasks

### Task 1: Onboard a New Employee

1. **Create Department** (if not exists)
   - Departments → Add Department

2. **Add Employee Record**
   - Employees → Add Employee
   - Fill all required information
   - Assign to department

3. **Create Initial Performance Goals**
   - Performance → Create Review
   - Set goals for probation period

### Task 2: Conduct Quarterly Performance Review

1. Go to Performance → Create Review
2. Select the employee
3. Set review period (e.g., Jan 1 - Mar 31)
4. Rate performance across categories
5. Add comments and feedback
6. Set goals for next quarter
7. Save as "Submitted" or "Reviewed"

### Task 3: Generate Department Report

1. Go to Dashboard
2. View "Department Distribution" section
3. See employee count per department
4. Click on Departments to see detailed info

### Task 4: Manage Employee Status

1. Go to Employees
2. Click "Edit" on the employee
3. Update Status:
   - **Active**: Currently working
   - **On Leave**: Temporary leave
   - **Inactive**: Not currently active
   - **Terminated**: No longer with company
4. Save changes

---

## 🔐 User Roles and Permissions

### Admin
- Full access to all features
- Can manage employees, departments, and performance reviews
- Can create other admin/manager/employee users

### Manager
- Can manage employees in their department
- Can create and view performance reviews
- Can manage departments
- Cannot delete critical records

### Employee
- Can view their own profile
- Can view their performance reviews
- Can view colleagues in their department
- Cannot modify employee or department data

---

## 🔍 Search and Filter Features

### Employee Search
- Search by name (first or last)
- Search by email
- Filter by department
- Filter by status

### Performance Reviews
- Filter by employee
- Filter by status
- Sort by date or rating

### Departments
- View all departments
- Filter by status (Active/Inactive)
- See employee count per department

---

## 📊 Key Features

✅ **Employee Management**
- Add, edit, view, delete employees
- Complete employee profiles
- Track employment status
- Department assignments

✅ **Performance Management**
- Create detailed performance reviews
- Rate across multiple categories
- Set goals and track progress
- View performance history

✅ **Department Management**
- Organize employees by department
- Assign department heads
- Set budgets and locations
- Track department statistics

✅ **Authentication & Security**
- Secure JWT-based authentication
- Role-based access control
- Password encryption
- Protected routes

✅ **Dashboard Analytics**
- Employee statistics
- Performance metrics
- Department distribution
- Quick overview

---

## 🛠️ Troubleshooting

### Issue: Cannot connect to database
**Solution:**
1. Check if MongoDB Atlas IP is whitelisted
2. Verify MONGO_URI in .env file
3. Ensure database user has correct permissions

### Issue: "Token failed" error
**Solution:**
1. Clear browser cache and localStorage
2. Log out and log back in
3. Check if JWT_SECRET is set in .env

### Issue: Cannot create employee
**Solution:**
1. Ensure at least one department exists
2. Check if email is unique
3. Verify all required fields are filled

### Issue: Port already in use
**Solution:**
```cmd
# Change PORT in .env file to different number
PORT=5001
```

### Issue: Frontend cannot connect to backend
**Solution:**
1. Check if backend is running on port 5000
2. Verify proxy setting in client/package.json
3. Check CORS configuration

---

## 📝 Sample Data for Testing

### Sample Admin User
- Name: Admin User
- Email: admin@company.com
- Password: admin123
- Role: Admin

### Sample Departments
1. IT Department (IT)
2. Human Resources (HR)
3. Sales (SAL)
4. Marketing (MKT)

### Sample Employees
1. John Doe - Software Engineer - IT
2. Jane Smith - HR Manager - HR
3. Mike Johnson - Sales Executive - SAL
4. Sarah Williams - Marketing Specialist - MKT

---

## 🎓 Best Practices

1. **Create departments first** before adding employees
2. **Use meaningful department codes** (2-4 letters)
3. **Regular performance reviews** (quarterly or bi-annually)
4. **Keep employee data updated** (addresses, contacts)
5. **Set realistic goals** in performance reviews
6. **Use proper status** when employees leave or take leave
7. **Regular backups** of MongoDB database
8. **Update passwords** regularly for security

---

## 📞 Need Help?

- Check README.md for project overview
- See MONGODB_SETUP.md for database configuration
- See DEPLOYMENT.md for production deployment
- Review code comments for technical details

---

## 🚦 System Status Indicators

### Employee Status
- 🟢 **Active**: Currently working
- 🟡 **On Leave**: Temporarily away
- 🔴 **Inactive**: Not currently working
- ⚫ **Terminated**: Left the company

### Performance Review Status
- 📝 **Draft**: Work in progress
- 📤 **Submitted**: Pending manager review
- ✅ **Reviewed**: Completed by manager
- 👍 **Acknowledged**: Seen by employee

### Department Status
- 🟢 **Active**: Operational
- 🔴 **Inactive**: Not operational

---

## ⚡ Pro Tips

1. **Use Chrome DevTools** to debug frontend issues
2. **Check browser console** for error messages
3. **Use Postman** to test API endpoints directly
4. **Enable MongoDB logs** for database debugging
5. **Use meaningful names** for better organization
6. **Regular data cleanup** for better performance
7. **Set up automated backups** for data safety

---

Enjoy using the Employee Management System! 🎉
