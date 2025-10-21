# 🚀 Employee Management System# Employee Performance and Management System



A full-stack **Employee Management System** built with the MERN stack (MongoDB, Express.js, React, Node.js). This application provides comprehensive workforce management with role-based access control, performance tracking, and secure authentication.A full-fledged Employee Performance and Management System built with the MERN stack (MongoDB, Express, React, Node.js).



> **Final Year Project** - Computer Science & Engineering## Features



---### Employee Management

- Add, edit, view, and delete employees

## ✨ Features- Employee profiles with detailed information

- Department assignment

### 🔐 Authentication & Security- Role-based access control

- **JWT-based Authentication** with 24-hour token expiration

- **Role-Based Access Control** (Admin, HR, Manager, Employee)### Performance Management

- **Server Session Tracking** - Automatic logout on server restart- Create and manage performance reviews

- **Token Validation** on application load- Set performance goals and KPIs

- **Secure Password Handling** with bcrypt hashing- Track performance metrics

- **Protected Routes** with middleware authorization- Performance rating system (1-5 scale)

- Review history and comments

### 👥 Employee Management

- Complete CRUD operations for employee records### Department Management

- Employee profile with detailed information- Create and manage departments

- Department assignment and tracking- Assign department heads

- Position and salary management- View department statistics

- Hire date and status tracking

- Search and filter employees### Authentication & Authorization

- Secure JWT-based authentication

### 🏢 Department Management- Role-based access (Admin, Manager, Employee)

- Create and manage departments- Protected routes

- Assign department heads (managers)

- Track employee count per department### Dashboard

- Department-wise employee listing- Overview statistics

- Budget and resource allocation- Recent activities

- Performance summaries

### 📊 Performance Management- Quick actions

- Create and track performance reviews

- Rate employees on multiple metrics## Tech Stack

- Add detailed feedback and comments

- View performance history### Backend

- Filter by date range and rating- **Node.js** - Runtime environment

- Performance analytics dashboard- **Express.js** - Web framework

- **MongoDB Atlas** - Cloud database

### 🎨 Modern UI/UX- **Mongoose** - ODM for MongoDB

- **Gradient Theme** (Purple/Blue) throughout the application- **JWT** - Authentication

- Responsive design for all screen sizes- **bcryptjs** - Password hashing

- Smooth animations and transitions

- Clean and intuitive interface### Frontend

- Professional login/authentication screens- **React.js** - UI library

- Interactive dashboards with stats- **React Router** - Navigation

- **Axios** - HTTP client

### 📈 Dashboard & Analytics- **Context API** - State management

- Real-time statistics (Total Employees, Departments, Active Reviews)

- Recent employees list## Getting Started

- Department overview

- Performance metrics visualization### Prerequisites

- Role-specific dashboard views- Node.js (v14 or higher)

- MongoDB Atlas account

---- npm or yarn



## 🛠️ Tech Stack### Installation



### Frontend1. Clone the repository:

- **React** 18.2.0 - UI framework```bash

- **React Router** 6.16.0 - Navigation and routinggit clone <repository-url>

- **Axios** - HTTP client for API callscd employee-management-system

- **Context API** - State management```

- **CSS3** - Custom styling with gradients and animations

2. Install dependencies for both backend and frontend:

### Backend```bash

- **Node.js** - Runtime environmentnpm run install-all

- **Express.js** 4.18.2 - Web framework```

- **MongoDB Atlas** - Cloud database

- **Mongoose** - ODM for MongoDB3. Configure MongoDB Atlas:

- **JWT** (jsonwebtoken) - Authentication tokens   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas

- **bcryptjs** - Password hashing   - Create a new cluster

- **express-validator** - Input validation   - Get your connection string

   - Whitelist your IP address

### Security

- **JWT tokens** with 24h expiration4. Set up environment variables:

- **Server session tracking** for forced logout   - Copy `.env.example` to `.env`

- **Password encryption** with bcrypt   - Update the following variables:

- **Input validation** on all endpoints     - `MONGO_URI`: Your MongoDB Atlas connection string

- **Protected API routes** with middleware     - `JWT_SECRET`: A secure random string

- **CORS** configuration for secure communication     - `PORT`: Server port (default: 5000)



---5. Start the application:



## 📋 Prerequisites   **Development mode (both frontend and backend):**

   ```bash

Before running this project, make sure you have:   npm run dev

   ```

- **Node.js** (v14 or higher)

- **npm** (v6 or higher)   **Backend only:**

- **MongoDB Atlas Account** (or local MongoDB installation)   ```bash

- **Git** (for cloning the repository)   npm run server

   ```

---

   **Frontend only:**

## 🚀 Installation & Setup   ```bash

   npm run client

### 1. Clone the Repository   ```



```bash   **Production:**

git clone <your-repo-url>   ```bash

cd EcomClone   npm start

```   ```



### 2. Backend Setup## API Endpoints



```bash### Authentication

cd backend- `POST /api/auth/register` - Register new user

npm install- `POST /api/auth/login` - Login user

```

### Employees

Create a `.env` file in the `backend` directory:- `GET /api/employees` - Get all employees

- `GET /api/employees/:id` - Get employee by ID

```env- `POST /api/employees` - Create new employee

NODE_ENV=development- `PUT /api/employees/:id` - Update employee

PORT=5000- `DELETE /api/employees/:id` - Delete employee

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_jwt_key_here### Performance Reviews

ALLOW_PUBLIC_REGISTRATION=false- `GET /api/performance` - Get all reviews

```- `GET /api/performance/employee/:id` - Get reviews for specific employee

- `POST /api/performance` - Create new review

**Important:** Replace the values with your actual credentials:- `PUT /api/performance/:id` - Update review

- `MONGO_URI`: Your MongoDB Atlas connection string- `DELETE /api/performance/:id` - Delete review

- `JWT_SECRET`: A strong random secret key (minimum 32 characters)

### Departments

### 3. Frontend Setup- `GET /api/departments` - Get all departments

- `GET /api/departments/:id` - Get department by ID

```bash- `POST /api/departments` - Create new department

cd ../client- `PUT /api/departments/:id` - Update department

npm install- `DELETE /api/departments/:id` - Delete department

```

## Default Admin Credentials

Create a `.env` file in the `client` directory:

After first run, you can create an admin user via the registration page with role "admin".

```env

REACT_APP_API_URL=http://localhost:5000## Project Structure

```

```

### 4. Database Setupemployee-management-system/

├── backend/

The application will automatically create the necessary collections when you start using it. However, you need to create an **admin user** first.│   ├── config/

│   │   └── db.js

**Option 1: Using MongoDB Compass or Atlas UI**│   ├── models/

│   │   ├── User.js

Insert this document into the `users` collection:│   │   ├── Employee.js

│   │   ├── Performance.js

```json│   │   └── Department.js

{│   ├── routes/

  "name": "Admin User",│   │   ├── auth.js

  "email": "admin@emp.com",│   │   ├── employees.js

  "password": "$2a$10$YourHashedPasswordHere",│   │   ├── performance.js

  "role": "admin",│   │   └── departments.js

  "createdAt": "2024-01-01T00:00:00.000Z"│   ├── middleware/

}│   │   └── auth.js

```│   └── server.js

├── client/

**Option 2: Temporarily enable registration**│   ├── public/

│   ├── src/

Set `ALLOW_PUBLIC_REGISTRATION=true` in backend `.env`, register an admin user, then set it back to `false`.│   │   ├── components/

│   │   ├── context/

---│   │   ├── pages/

│   │   ├── services/

## ▶️ Running the Application│   │   ├── App.js

│   │   └── index.js

### Start Backend Server│   └── package.json

├── .env.example

```bash├── .gitignore

cd backend├── package.json

npm start└── README.md

``````



Server will run on: `http://localhost:5000`## Contributing



### Start Frontend Development ServerContributions are welcome! Please feel free to submit a Pull Request.



```bash## License

cd client

npm startThis project is licensed under the ISC License.

```

Application will open on: `http://localhost:3001`

### Access the Application

1. Open your browser and navigate to `http://localhost:3001`
2. Login with your credentials:
   - **Email:** `admin@emp.com`
   - **Password:** Your admin password

---

## 👤 User Roles & Permissions

### 🔴 Admin
- Full system access
- Manage all employees, departments, and users
- Create/edit/delete any record
- Access all dashboards and reports
- User management capabilities

### 🟠 HR (Human Resources)
- Manage employees (create, edit, view)
- Manage departments
- Create and view performance reviews
- Access employee records and statistics
- Cannot manage system users

### 🟡 Manager
- View all employees in their department
- Create performance reviews for team members
- View department statistics
- Limited edit permissions

### 🟢 Employee
- View own profile and information
- View own performance reviews
- Limited dashboard access
- No edit or delete permissions

---

## 📁 Project Structure

```
EcomClone/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                # JWT authentication & authorization
│   ├── models/
│   │   ├── User.js                # User model
│   │   ├── Employee.js            # Employee model
│   │   ├── Department.js          # Department model
│   │   └── Performance.js         # Performance review model
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   ├── employees.js           # Employee CRUD routes
│   │   ├── departments.js         # Department routes
│   │   ├── performance.js         # Performance review routes
│   │   └── users.js               # User management routes
│   ├── utils/
│   │   └── serverSession.js       # Server session tracking
│   ├── .env                       # Environment variables
│   ├── server.js                  # Express app entry point
│   └── package.json
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js          # Navigation component
│   │   ├── context/
│   │   │   └── AuthContext.js     # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Dashboard.js       # Main dashboard
│   │   │   ├── Employees.js       # Employee list
│   │   │   ├── EmployeeForm.js    # Add/Edit employee
│   │   │   ├── EmployeeDetail.js  # Employee details
│   │   │   ├── Departments.js     # Department list
│   │   │   ├── DepartmentForm.js  # Add/Edit department
│   │   │   ├── Performance.js     # Performance reviews
│   │   │   ├── PerformanceForm.js # Create review
│   │   │   ├── Users.js           # User management
│   │   │   ├── Auth.css           # Authentication styles
│   │   │   └── Dashboard.css      # Dashboard styles
│   │   ├── services/
│   │   │   └── authService.js     # API service layer
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # React entry point
│   ├── .env                       # Frontend environment variables
│   └── package.json
│
├── SECURITY_IMPROVEMENTS.md       # Security documentation
├── TESTING_SERVER_RESTART_LOGOUT.md # Testing guide
├── IMPLEMENTATION_SUMMARY.md      # Implementation details
└── README.md                      # This file
```

---

## 🔒 Security Features

### 1. **Server Session Tracking**
- Stores server start timestamp
- Validates tokens against current server session
- Forces logout on server restart
- Prevents tokens from previous sessions

### 2. **Token Validation on Load**
- Validates JWT token with backend on every app load
- Automatic logout if token is invalid or expired
- Checks user existence in database
- Handles server restart scenarios

### 3. **24-Hour Token Expiration**
- Short-lived JWT tokens (24 hours)
- Users must re-login daily
- Reduces risk of token theft
- Better security posture

### 4. **Password Security**
- bcrypt hashing with salt rounds
- Passwords never stored in plain text
- Secure password comparison
- Password complexity can be enforced

### 5. **Role-Based Access Control**
- Middleware-level authorization
- Route protection by user role
- Frontend route guards
- API endpoint protection

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (disabled by default)
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Validate JWT token
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees (with pagination)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Performance Reviews
- `GET /api/performance` - Get all reviews
- `GET /api/performance/:id` - Get review by ID
- `POST /api/performance` - Create review
- `PUT /api/performance/:id` - Update review
- `DELETE /api/performance/:id` - Delete review

### Users
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

---

## 🧪 Testing

### Testing Server Restart Logout Feature

See detailed testing guide: [TESTING_SERVER_RESTART_LOGOUT.md](./TESTING_SERVER_RESTART_LOGOUT.md)

**Quick Test:**
1. Login to the application
2. Stop the backend server (Ctrl+C)
3. Restart the backend server
4. Refresh the browser
5. ✅ You should be automatically logged out

---

## 📸 Screenshots

### Login Page
Professional gradient-themed login with session expiration handling.

### Dashboard
Real-time statistics, recent employees, and department overview.

### Employee Management
Complete CRUD operations with search and filter capabilities.

### Performance Reviews
Track and manage employee performance with detailed feedback.

---

## 🎓 Academic Project Information

**Project Title:** Employee Management System using MERN Stack

**Objective:** To develop a full-stack web application for managing employee records, departments, and performance reviews with secure role-based authentication.

**Key Achievements:**
- ✅ Full-stack MERN implementation
- ✅ RESTful API design
- ✅ JWT authentication with security features
- ✅ Role-based access control
- ✅ Responsive UI with modern design
- ✅ Comprehensive documentation
- ✅ Production-ready security measures

**Technologies Demonstrated:**
- Frontend: React, React Router, Context API, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Security: JWT, bcrypt, token validation, session tracking
- Database: MongoDB Atlas (Cloud NoSQL)
- Deployment: Ready for deployment on Heroku/Vercel/Netlify

---

## 🚀 Deployment

### Backend Deployment (Heroku/Render)

1. Create a new app on Heroku/Render
2. Set environment variables (MONGO_URI, JWT_SECRET, PORT)
3. Deploy using Git or GitHub integration
4. Ensure MongoDB Atlas IP whitelist allows connections

### Frontend Deployment (Vercel/Netlify)

1. Update API URL in `.env` to your deployed backend URL
2. Build the production version: `npm run build`
3. Deploy the `build` folder to Vercel/Netlify
4. Configure environment variables in deployment settings

---

## 🐛 Known Issues & Limitations

- Public registration is disabled by default (create users via database or admin panel)
- File upload for employee photos not implemented (can be added)
- Email notifications not implemented (can be added with nodemailer)
- Advanced reporting/analytics features can be expanded

---

## 🔮 Future Enhancements

- [ ] Employee photo upload and storage
- [ ] Advanced analytics and reporting dashboard
- [ ] Email notifications for performance reviews
- [ ] Leave management system
- [ ] Attendance tracking
- [ ] Payroll integration
- [ ] Document management
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export data to PDF/Excel
- [ ] Refresh token implementation
- [ ] Two-factor authentication (2FA)

---

## 🤝 Contributing

This is an academic project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is created for academic purposes as a Final Year Project.

---

## 👨‍💻 Author

**Your Name**
- Final Year Student - Computer Science & Engineering
- Contact: your.email@example.com
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [@YourGitHubUsername]

---

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- React and Node.js communities for excellent documentation
- All open-source libraries used in this project
- Project guide and faculty members for their guidance

---

## 📞 Support

For any queries regarding this project:
- Create an issue in this repository
- Contact via email: your.email@example.com

---

**⭐ If you find this project helpful, please consider giving it a star!**

---

*Built with ❤️ using MERN Stack*
