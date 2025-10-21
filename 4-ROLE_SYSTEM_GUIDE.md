# 4-Role System Implementation Guide

## Overview
The Employee Management System now supports **4 distinct roles**: Admin, HR, Manager, and Employee.

---

## Role Definitions

### 1. **ADMIN** (System Administrator)
- **Count**: 1 person
- **Purpose**: System owner, IT manager
- **Full Access**: Complete control over the entire system

**Permissions:**
- ✅ Create, edit, delete employees (all departments)
- ✅ Create, edit, delete departments
- ✅ Create, edit, delete performance reviews (all employees)
- ✅ Create user accounts for all roles (Admin, HR, Manager, Employee)
- ✅ View all statistics (company-wide)
- ✅ Manage system settings
- ✅ Delete any data

**Use Case:** IT Manager, System Owner

---

### 2. **HR** (Human Resources)
- **Count**: 1-5 people typically
- **Purpose**: Employee management, onboarding, records maintenance
- **Cross-Department Access**: Can view and manage ALL employees

**Permissions:**
- ✅ View ALL employees (across all departments)
- ✅ Create employees (all departments)
- ✅ Edit employee information (personal info, salary, position)
- ✅ Create user accounts (HR, Manager, Employee roles only)
- ✅ View ALL performance reviews (read-only)
- ✅ View all company statistics
- ✅ View all departments
- ❌ **Cannot** create/edit/delete departments
- ❌ **Cannot** create/edit/delete performance reviews
- ❌ **Cannot** delete employees

**Use Case:** HR Manager, HR Specialist, Recruiter

---

### 3. **MANAGER** (Department/Team Manager)
- **Count**: Multiple (one or more per department)
- **Purpose**: Manage team, conduct performance reviews
- **Department-Specific Access**: Can only see their department

**Permissions:**
- ✅ View employees in THEIR DEPARTMENT only
- ✅ Edit employees in their department (limited fields)
- ✅ Create, edit, delete performance reviews (their department only)
- ✅ View department statistics (their department only)
- ✅ View their department information
- ❌ **Cannot** see other departments' employees
- ❌ **Cannot** create employees
- ❌ **Cannot** create user accounts
- ❌ **Cannot** create/edit/delete departments
- ❌ **Cannot** delete employees

**Use Case:** Engineering Manager, Sales Manager, Team Lead

---

### 4. **EMPLOYEE** (Regular Staff)
- **Count**: Most of workforce
- **Purpose**: Self-service, view own data
- **Self-Only Access**: Can only see their own information

**Permissions:**
- ✅ View own profile
- ✅ View own performance reviews
- ✅ View own dashboard (personal statistics)
- ❌ **Cannot** see other employees
- ❌ **Cannot** see company statistics
- ❌ **Cannot** create, edit, or delete anything

**Use Case:** Developer, Sales Rep, Marketing Specialist, All regular staff

---

## Access Control Matrix

| Feature | Admin | HR | Manager | Employee |
|---------|-------|-----|---------|----------|
| **Employees** |
| View all employees | ✅ | ✅ | ❌ | ❌ |
| View department employees | ✅ | ✅ | ✅ | ❌ |
| View own profile | ✅ | ✅ | ✅ | ✅ |
| Create employees | ✅ | ✅ | ❌ | ❌ |
| Edit all employees | ✅ | ✅ | ❌ | ❌ |
| Edit department employees | ✅ | ✅ | ✅ | ❌ |
| Delete employees | ✅ | ❌ | ❌ | ❌ |
| **Departments** |
| View departments | ✅ | ✅ | ✅ | ✅ |
| Create departments | ✅ | ❌ | ❌ | ❌ |
| Edit departments | ✅ | ❌ | ❌ | ❌ |
| Delete departments | ✅ | ❌ | ❌ | ❌ |
| **Performance Reviews** |
| View all reviews | ✅ | ✅ (RO) | ❌ | ❌ |
| View department reviews | ✅ | ✅ (RO) | ✅ | ❌ |
| View own reviews | ✅ | ✅ | ✅ | ✅ |
| Create reviews | ✅ | ❌ | ✅ (dept) | ❌ |
| Edit reviews | ✅ | ❌ | ✅ (dept) | ❌ |
| Delete reviews | ✅ | ❌ | ✅ (dept) | ❌ |
| **Statistics** |
| View company stats | ✅ | ✅ | ❌ | ❌ |
| View department stats | ✅ | ✅ | ✅ | ❌ |
| View own stats | ✅ | ✅ | ✅ | ✅ |
| **User Accounts** |
| Create Admin accounts | ✅ | ❌ | ❌ | ❌ |
| Create HR accounts | ✅ | ✅ | ❌ | ❌ |
| Create Manager accounts | ✅ | ✅ | ❌ | ❌ |
| Create Employee accounts | ✅ | ✅ | ❌ | ❌ |

*(RO = Read-Only)*

---

## Implementation Details

### Backend Changes

#### 1. User Model Updated
```javascript
role: {
  type: String,
  enum: ['admin', 'hr', 'manager', 'employee'],
  default: 'employee'
}
```

#### 2. New Middleware Functions
```javascript
// HR or Admin
exports.hrOrAdmin = (req, res, next) => {
  if (req.user && ['admin', 'hr'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. HR or Admin access required.' });
  }
};

// HR, Manager, or Admin
exports.hrManagerOrAdmin = (req, res, next) => {
  if (req.user && ['admin', 'hr', 'manager'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied.' });
  }
};
```

#### 3. Updated Route Protection
- **Employees Routes**: Admin & HR can create/edit all, Manager can edit their dept
- **Performance Routes**: Admin & Manager can create/edit, HR can view all (read-only)
- **Department Routes**: Admin only for create/edit/delete
- **Stats Routes**: Admin & HR see all, Manager sees their dept

### Frontend Changes

#### 1. AuthContext Updated
```javascript
const isHR = () => {
  return user && (user.role === 'hr' || user.role === 'admin');
};

const isManager = () => {
  return user && ['admin', 'hr', 'manager'].includes(user.role);
};
```

#### 2. Employee Form Updated
- Added "HR" role option in dropdown
- Updated role descriptions

#### 3. UI Access Control
- Navigation items shown based on role
- Buttons and actions enabled/disabled based on permissions

---

## Usage Examples

### Creating an HR User

**As Admin:**
1. Login as Admin
2. Go to Employees → Add Employee
3. Fill in employee details:
   - Name: Jane Smith
   - Email: jane.smith@company.com
   - Department: Human Resources
   - Position: HR Manager
4. Check "Create user account"
5. Select Role: **HR**
6. Set temporary password
7. Save

**Result:** Jane can now login and manage ALL employees across ALL departments

---

### Creating a Manager User

**As Admin or HR:**
1. Go to Employees → Add Employee
2. Fill in details:
   - Name: John Doe
   - Email: john.doe@company.com
   - Department: Engineering
   - Position: Engineering Manager
3. Check "Create user account"
4. Select Role: **Manager**
5. Set temporary password
6. Save

**Result:** John can only see and manage employees in the Engineering department

---

### Creating an Employee User

**As Admin or HR:**
1. Go to Employees → Add Employee
2. Fill in details:
   - Name: Alice Brown
   - Email: alice.brown@company.com
   - Department: Engineering
   - Position: Software Developer
3. Check "Create user account"
4. Select Role: **Employee**
5. Set temporary password
6. Save

**Result:** Alice can only view her own profile and performance reviews

---

## Testing the 4-Role System

### Test 1: Admin Access
1. Login as Admin
2. Verify you can:
   - See all employees
   - Create departments
   - Create employees with any role
   - Create/edit performance reviews
   - View all statistics

### Test 2: HR Access
1. Create HR user
2. Login as HR
3. Verify you can:
   - See ALL employees (all departments)
   - Create employees
   - Create user accounts (HR, Manager, Employee)
   - View all performance reviews (cannot edit)
   - View all statistics
4. Verify you CANNOT:
   - Create/edit departments
   - Create/edit performance reviews
   - Delete employees

### Test 3: Manager Access
1. Create Manager user in Engineering dept
2. Login as Manager
3. Verify you can:
   - See only Engineering department employees
   - Edit employees in your department
   - Create/edit performance reviews for your team
   - View your department statistics
4. Verify you CANNOT:
   - See other departments' employees
   - Create employees
   - Create user accounts
   - View company-wide statistics
   - Create/edit departments

### Test 4: Employee Access
1. Create Employee user
2. Login as Employee
3. Verify you can:
   - See only your own profile
   - View your performance reviews
   - See your personal dashboard
4. Verify you CANNOT:
   - See other employees
   - See company statistics
   - Create or edit anything

---

## Migration from 3-Role to 4-Role System

**Old System:**
- admin
- manager
- employee

**New System:**
- admin
- **hr** (NEW)
- manager
- employee

**What to do with existing users:**
1. **Admins**: No change needed
2. **Managers**: No change needed
3. **Employees**: No change needed
4. **HR Staff**: If they had "manager" role, update to "hr" role

---

## Best Practices

### 1. Role Assignment
- **Admin**: Only 1 person (IT Manager/System Owner)
- **HR**: 1-5 people (HR team)
- **Manager**: One per department/team
- **Employee**: Everyone else

### 2. Department Structure
```
Company
├── Human Resources (HR staff here)
├── Engineering (Manager + Employees)
├── Sales (Manager + Employees)
├── Marketing (Manager + Employees)
└── Finance (Manager + Employees)
```

### 3. Typical User Creation Flow
1. **Admin** creates HR users
2. **Admin or HR** create Manager users
3. **Admin or HR** create Employee users
4. **Managers** conduct performance reviews for their team

### 4. Security
- HR should ONLY be assigned to HR department staff
- Managers should be properly assigned to their departments
- Regular audits of user roles
- Remove access when employees leave

---

## Troubleshooting

### Issue: Manager can't see their team
**Solution**: Check that:
1. Manager's employee record has a department assigned
2. Team members have the SAME department assigned
3. Manager role is set correctly

### Issue: HR can't create employees
**Solution**: Verify:
1. User role is "hr" (not "manager")
2. HR has completed employee record
3. No conflicting middleware

### Issue: Employee sees too much data
**Solution**: Check:
1. User role is exactly "employee" (lowercase)
2. No admin/manager/hr role assigned
3. Backend filtering is working

---

## API Documentation

### Role-Based Endpoints

#### GET /api/employees
- **Admin**: All employees
- **HR**: All employees
- **Manager**: Department employees only
- **Employee**: Self only

#### POST /api/employees/create-with-user
- **Admin**: Can create any role
- **HR**: Can create HR, Manager, Employee
- **Manager**: ❌ Denied
- **Employee**: ❌ Denied

#### GET /api/performance/stats/overview
- **Admin**: All stats
- **HR**: All stats
- **Manager**: Department stats
- **Employee**: ❌ Denied

---

## Summary

✅ **4-Role System Implemented**
- Admin: System owner
- HR: People management (cross-department)
- Manager: Team management (department-specific)
- Employee: Self-service

✅ **Proper Separation of Concerns**
✅ **Scalable & Maintainable**
✅ **Real-World Aligned**

The system is now ready for production use with proper role-based access control! 🎉
