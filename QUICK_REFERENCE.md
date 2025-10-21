# Quick Reference Guide - Employee Management System

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
npm start
```
**URL**: http://localhost:5000

### Frontend
```bash
cd client
npm start
```
**URL**: http://localhost:3001

---

## 🔐 Test Credentials

### Admin User
- **Email**: admin@company.com
- **Password**: admin123
- **Access**: Full system access, can manage users

### HR User
- **Email**: hr@company.com
- **Password**: hr123
- **Access**: Manage all employees

### Manager User
- **Email**: manager@company.com
- **Password**: manager123
- **Access**: View and manage department employees

### Employee User
- **Email**: employee@company.com
- **Password**: employee123
- **Access**: View own profile and reviews

---

## 📁 Project Structure

```
EcomClone/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
│
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React Context
│   │   └── styles/      # Global styles
│   └── public/
│
└── UI_REDESIGN_SUMMARY.md  # Complete redesign documentation
```

---

## 🎨 Design System

### Colors
```css
/* Primary Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success */
background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);

/* Warning */
background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);

/* Danger */
background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);

/* Info */
background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
```

### Common Classes
- `.btn-primary` - Purple gradient button
- `.btn-secondary` - Gray gradient button
- `.btn-danger` - Red gradient button
- `.badge-success` - Green badge
- `.badge-warning` - Orange badge
- `.badge-danger` - Red badge
- `.card` - White card container

---

## 🔧 Common Tasks

### Create New Employee
1. Login as Admin/HR/Manager
2. Go to Employees page
3. Click "+ Add Employee"
4. Fill form
5. Check "Create user account" if they need login access
6. Set role and temporary password
7. Click "Create Employee"

### Update User Role
1. Login as Admin
2. Go to Users page
3. Select role from dropdown
4. Role updates automatically

### Add Department
1. Login as Admin/HR
2. Go to Departments page
3. Click "+ Add Department"
4. Fill department details
5. Click "Create Department"

### View Dashboard
- **Admin/HR/Manager**: See employee stats, performance data
- **Employee**: See own profile and reviews

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 3001 (Frontend)
npx kill-port 3001
```

### Clear Browser Storage
If you encounter login issues:
1. Open browser console (F12)
2. Go to Application tab
3. Clear localStorage
4. Refresh page

Or visit: http://localhost:3001/clear-storage.html

### MongoDB Connection Error
- Check internet connection
- Verify MongoDB Atlas cluster is running
- Check connection string in `.env` file

### JWT Token Errors
- System auto-redirects to login
- Just login again with valid credentials

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user

### Employees
- `GET /api/employees` - Get all employees (with filters)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `POST /api/employees/create-with-user` - Create employee with user account
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Users
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)

### Performance
- `GET /api/performance` - Get all reviews
- `POST /api/performance` - Create review
- `GET /api/performance/employee/:id` - Get employee reviews

---

## 🎯 Role Permissions

### Admin
- ✅ Full system access
- ✅ Manage all employees
- ✅ Manage departments
- ✅ Manage user roles
- ✅ View all data

### HR
- ✅ Manage all employees
- ✅ Manage departments
- ✅ View all data
- ❌ Cannot manage user roles

### Manager
- ✅ View department employees
- ✅ Manage department employees
- ✅ View department analytics
- ❌ Cannot manage other departments

### Employee
- ✅ View own profile
- ✅ View own performance reviews
- ❌ Cannot view other employees
- ❌ Cannot edit any data

---

## 🌟 Key Features for Demo

1. **Modern UI Design**
   - Show gradient theme consistency
   - Demonstrate animations
   - Highlight responsive design

2. **Role-Based Access**
   - Login as different roles
   - Show different views/permissions

3. **Employee Management**
   - Create employee with user account
   - Show search and filters
   - Demonstrate CRUD operations

4. **Dashboard Analytics**
   - Show real-time stats
   - Demonstrate data visualization
   - Highlight role-specific views

5. **Department Organization**
   - Show department cards
   - Demonstrate department management

---

## 📱 Testing Checklist

### Desktop (1920x1080)
- [ ] Login page displays correctly
- [ ] Dashboard shows all stats
- [ ] Tables are properly sized
- [ ] Forms are easy to use
- [ ] All animations work

### Tablet (768x1024)
- [ ] Responsive layout works
- [ ] Navigation adjusts
- [ ] Cards stack properly
- [ ] Forms remain usable

### Mobile (375x667)
- [ ] Mobile menu works
- [ ] Tables scroll horizontally
- [ ] Forms are touch-friendly
- [ ] All features accessible

---

## 🔥 Performance Tips

1. **Keep only one browser tab open** for the app
2. **Clear browser cache** if styling doesn't update
3. **Restart servers** if changes don't reflect
4. **Use Chrome DevTools** for responsive testing
5. **Check Console** for any errors

---

## 📞 Support

If you encounter issues:
1. Check the console for errors (F12)
2. Verify both servers are running
3. Clear browser cache and localStorage
4. Restart both backend and frontend servers

---

## 🎓 For Presentation

### Opening
"I've developed a full-stack Employee Management System using the MERN stack with a modern, professional UI designed specifically for enterprise use."

### Features to Highlight
1. Complete CRUD operations
2. Role-based access control (4 roles)
3. Responsive design (mobile to desktop)
4. Modern gradient-based UI
5. Smooth animations and transitions
6. Cloud database with MongoDB Atlas
7. JWT authentication
8. Professional dashboard with analytics

### Technical Stack
- **Frontend**: React 18, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Modern CSS with gradients and animations

### Closing
"This system is production-ready and follows industry best practices for security, scalability, and user experience."

---

## ✨ Final Checklist Before Presentation

- [ ] Both servers running
- [ ] Test all user roles work
- [ ] Verify all CRUD operations
- [ ] Check responsive design
- [ ] Test animations work
- [ ] Prepare demo data
- [ ] Screenshot key features
- [ ] Practice presentation flow

---

**Good luck! 🚀**
