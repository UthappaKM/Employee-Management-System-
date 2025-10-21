# Security Features - Employee Management System

## Overview
This document describes the security features implemented in the Employee Management System, specifically the admin-controlled employee account creation system.

## Security Implementation

### 1. Disabled Public Registration
- **Setting**: `ALLOW_PUBLIC_REGISTRATION=false` in `.env` file
- **Effect**: Regular users cannot register themselves
- **Login Page**: Shows message "Contact your administrator to create an account"
- **Register Page**: Disabled form with warning message

### 2. Admin-Only Employee Creation
- **Endpoint**: `POST /api/employees/create-with-user`
- **Access**: Admin only (protected by `protect` + `admin` middleware)
- **Functionality**: Admin creates both employee record AND user account together

### 3. How It Works

#### For Administrators:
1. Login as Admin
2. Go to "Employees" page
3. Click "+ Add Employee" button
4. Fill in employee details INCLUDING:
   - Personal Information (Name, Email, Phone, etc.)
   - Employment Details (Position, Department, Salary, etc.)
   - **User Account Settings**:
     - ☑️ Create User Account (checkbox - enabled by default)
     - User Role: Employee / Manager
     - Temporary Password: (Admin sets this)
5. Click "Create Employee"
6. System creates:
   - ✅ Employee record (in `employees` collection)
   - ✅ User account (in `users` collection) with hashed password
   - ✅ Links them together (`userId` in employee, `employeeId` in user)

#### For Employees:
1. Admin provides them with:
   - Email address
   - Temporary password
2. Employee goes to Login page
3. Employee enters credentials and logs in
4. Employee can then change password in their profile

## API Endpoints

### Create Employee with User Account
```
POST /api/employees/create-with-user
Authorization: Bearer {admin_token}

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "position": "Software Developer",
  "department": "64a1b2c3d4e5f6g7h8i9j0k1",
  "salary": 75000,
  "status": "active",
  "createUserAccount": true,
  "userRole": "employee",
  "temporaryPassword": "Welcome@123"
}

Response:
{
  "employee": { ... employee details ... },
  "user": {
    "id": "user_id",
    "email": "john.doe@company.com",
    "role": "employee"
  },
  "temporaryPassword": "Welcome@123"
}
```

## Database Schema Updates

### Employee Model
Added field:
```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
```

### User Model
Already had field:
```javascript
employeeId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Employee'
}
```

## Security Benefits

1. **Controlled Access**: Only admins can create accounts
2. **No Unauthorized Registration**: Prevents random people from creating accounts
3. **Complete Employee Records**: Ensures every user has a corresponding employee record
4. **Audit Trail**: Admin knows who created which accounts
5. **Password Management**: Admin sets initial password, employee changes it on first login
6. **Role Control**: Admin decides if user is employee or manager

## Future Enhancements (Optional)

1. **Force Password Change**: Require password change on first login
2. **Password Reset**: Admin can reset employee passwords
3. **Account Activation**: Employees must activate via email before logging in
4. **Two-Factor Authentication**: Add 2FA for extra security
5. **Session Management**: Track active sessions and allow admin to terminate them
6. **Login Attempt Limits**: Lock account after multiple failed login attempts

## Environment Variables

```env
# In .env file
ALLOW_PUBLIC_REGISTRATION=false  # Set to 'true' to enable public registration (NOT RECOMMENDED)
```

## Testing the Feature

### Test as Admin:
1. Login as Admin1
2. Create department first
3. Go to Employees → Add Employee
4. Fill form with user account details
5. Note the temporary password
6. Logout

### Test as Employee:
1. Go to Login page
2. Use email and temporary password
3. Should login successfully
4. See employee dashboard with personal details

## Notes

- The old `/api/auth/register` endpoint still exists but returns 403 error when `ALLOW_PUBLIC_REGISTRATION=false`
- Keep `ALLOW_PUBLIC_REGISTRATION=false` in production for security
- Admins should use strong temporary passwords
- Consider implementing password change on first login (future enhancement)
