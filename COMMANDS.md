# Employee Performance and Management System - Command Reference

## 📋 Quick Commands Cheat Sheet

### Installation Commands

```cmd
# Install all dependencies (backend + frontend)
npm run install-all

# Install backend dependencies only
npm install

# Install frontend dependencies only
cd client
npm install
cd ..
```

### Running the Application

```cmd
# Run both frontend and backend together (RECOMMENDED for development)
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Run in production mode
npm start
```

### MongoDB Atlas Setup

```cmd
# Copy environment example file
copy .env.example .env

# Then edit .env file with your MongoDB Atlas credentials
notepad .env
```

### Git Commands (For Version Control)

```cmd
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Employee Management System"

# Add remote repository
git remote add origin YOUR_REPO_URL

# Push to GitHub
git push -u origin main
```

### Development Commands

```cmd
# Check for errors
npm run server  # Check backend
npm run client  # Check frontend

# View backend logs
# Backend logs will show in the terminal running the server

# View frontend in browser
# Open http://localhost:3000
```

---

## 🗂️ Project Structure

```
employee-management-system/
│
├── backend/                      # Backend Node.js/Express application
│   ├── config/
│   │   └── db.js                # MongoDB connection configuration
│   ├── models/
│   │   ├── User.js              # User authentication model
│   │   ├── Employee.js          # Employee data model
│   │   ├── Performance.js       # Performance review model
│   │   └── Department.js        # Department model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── employees.js         # Employee CRUD routes
│   │   ├── performance.js       # Performance review routes
│   │   └── departments.js       # Department routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   └── server.js                # Express server entry point
│
├── client/                       # Frontend React application
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js        # Navigation component
│   │   │   ├── Navbar.css
│   │   │   └── PrivateRoute.js  # Route protection component
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Dashboard.js     # Dashboard page
│   │   │   ├── Employees.js     # Employee list page
│   │   │   ├── EmployeeForm.js  # Add/Edit employee
│   │   │   ├── EmployeeDetail.js# Employee detail view
│   │   │   ├── Departments.js   # Department list page
│   │   │   ├── DepartmentForm.js# Add/Edit department
│   │   │   ├── Performance.js   # Performance review list
│   │   │   └── Auth.css         # Authentication styles
│   │   ├── services/
│   │   │   ├── api.js           # Axios configuration
│   │   │   ├── authService.js   # Auth API calls
│   │   │   ├── employeeService.js   # Employee API calls
│   │   │   ├── departmentService.js # Department API calls
│   │   │   └── performanceService.js # Performance API calls
│   │   ├── App.js               # Main app component
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   └── package.json             # Frontend dependencies
│
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Backend dependencies
├── Procfile                      # Heroku deployment config
├── README.md                     # Project overview
├── GETTING_STARTED.md            # Detailed user guide
├── MONGODB_SETUP.md              # MongoDB Atlas setup guide
├── DEPLOYMENT.md                 # Deployment instructions
└── API_DOCUMENTATION.md          # API reference
```

---

## 🔧 Environment Variables Explained

### Backend (.env)

```env
# MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/database_name
MONGO_URI=your_mongodb_atlas_connection_string

# Secret key for JWT token encryption (use a long random string)
JWT_SECRET=your_secret_key_here

# Port number for backend server (default: 5000)
PORT=5000

# Environment mode (development or production)
NODE_ENV=development

# Frontend URL for CORS policy
CLIENT_URL=http://localhost:3000
```

### Frontend (.env - if needed)

```env
# Backend API URL (optional, defaults to proxy in package.json)
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Startup Sequence

### First Time Setup

1. **Install Node.js** (if not installed)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Set up MongoDB Atlas**
   - Follow MONGODB_SETUP.md
   - Get connection string
   - Whitelist IP address

3. **Install Dependencies**
   ```cmd
   npm run install-all
   ```

4. **Configure Environment**
   ```cmd
   copy .env.example .env
   notepad .env
   ```
   - Update MONGO_URI with your connection string
   - Set JWT_SECRET to a random string

5. **Start Development Server**
   ```cmd
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

7. **Create First Admin User**
   - Go to http://localhost:3000
   - Click "Register"
   - Select role: "Admin"

---

## 📦 Package Scripts Explained

### Root package.json Scripts

```json
{
  "start": "node backend/server.js",           // Production mode
  "server": "nodemon backend/server.js",       // Dev mode (auto-restart)
  "client": "npm start --prefix client",       // Run frontend only
  "dev": "concurrently \"npm run server\" \"npm run client\"",  // Run both
  "install-all": "npm install && cd client && npm install"  // Install all deps
}
```

### Client package.json Scripts

```json
{
  "start": "react-scripts start",    // Start React dev server
  "build": "react-scripts build",    // Build for production
  "test": "react-scripts test",      // Run tests
  "eject": "react-scripts eject"     // Eject from CRA
}
```

---

## 🔍 Troubleshooting Commands

### Check if ports are in use

```cmd
# Check if port 5000 is in use (backend)
netstat -ano | findstr :5000

# Check if port 3000 is in use (frontend)
netstat -ano | findstr :3000

# Kill process using port (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Clear Node Modules and Reinstall

```cmd
# Remove node_modules
rmdir /s /q node_modules
rmdir /s /q client\node_modules

# Remove package-lock files
del package-lock.json
del client\package-lock.json

# Reinstall
npm run install-all
```

### Check Node and NPM versions

```cmd
node --version    # Should be v14 or higher
npm --version     # Should be v6 or higher
```

### View Backend Logs

Backend logs appear in the terminal where you ran `npm run server` or `npm run dev`

### Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

Or manually clear:
- Chrome: Settings → Privacy → Clear browsing data
- Edge: Settings → Privacy → Choose what to clear

---

## 📊 Useful Development Tools

### Postman (API Testing)
```
Download from: https://www.postman.com/downloads/
```

### MongoDB Compass (Database GUI)
```
Download from: https://www.mongodb.com/try/download/compass
```

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- MongoDB for VS Code
- Thunder Client (API testing)

---

## 🔐 Security Checklist

- [ ] .env file is in .gitignore
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Strong JWT_SECRET set
- [ ] Default passwords changed
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] SQL injection prevention (MongoDB escapes by default)
- [ ] XSS prevention (React escapes by default)

---

## 📝 Common Tasks Reference

### Add a New Feature

1. **Backend:**
   - Create model in `backend/models/`
   - Create routes in `backend/routes/`
   - Import routes in `backend/server.js`

2. **Frontend:**
   - Create service in `client/src/services/`
   - Create component/page in `client/src/pages/`
   - Add route in `client/src/App.js`

### Update Dependencies

```cmd
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update React packages
cd client
npm update
cd ..
```

### Create Production Build

```cmd
# Build frontend
cd client
npm run build
cd ..

# The build folder will contain optimized production files
```

---

## 🌐 URLs Reference

### Local Development
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Root:** http://localhost:5000/api

### API Endpoints
- **Auth:** http://localhost:5000/api/auth
- **Employees:** http://localhost:5000/api/employees
- **Departments:** http://localhost:5000/api/departments
- **Performance:** http://localhost:5000/api/performance

### Documentation Files
- **README.md** - Project overview
- **GETTING_STARTED.md** - User guide
- **API_DOCUMENTATION.md** - API reference
- **MONGODB_SETUP.md** - Database setup
- **DEPLOYMENT.md** - Production deployment

---

## 💡 Pro Tips

1. **Keep terminal windows organized:**
   - Terminal 1: Backend server
   - Terminal 2: Frontend server
   - Terminal 3: Git commands

2. **Use nodemon for auto-restart:**
   - Already configured with `npm run server`
   - Backend restarts automatically on file changes

3. **React hot reload:**
   - Frontend updates automatically on save
   - No need to refresh browser

4. **MongoDB Atlas monitoring:**
   - Check the Atlas dashboard regularly
   - Monitor connection count and queries

5. **Git best practices:**
   - Commit frequently with clear messages
   - Create branches for new features
   - Never commit .env file

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env or kill process |
| Cannot connect to DB | Check MONGO_URI and IP whitelist |
| CORS errors | Verify CLIENT_URL in .env |
| Module not found | Run `npm install` again |
| Login not working | Check JWT_SECRET is set |
| Frontend can't reach API | Ensure backend is running on port 5000 |

---

## 🎯 Next Steps

1. ✅ Complete MongoDB Atlas setup
2. ✅ Install dependencies
3. ✅ Configure .env file
4. ✅ Start development servers
5. ✅ Create admin user
6. ✅ Add departments
7. ✅ Add employees
8. ✅ Create performance reviews
9. 🔜 Deploy to production (see DEPLOYMENT.md)

---

**Happy Coding! 🚀**

For detailed documentation, see:
- User Guide: GETTING_STARTED.md
- API Reference: API_DOCUMENTATION.md
- Deployment: DEPLOYMENT.md
