# API Documentation

Base URL: `http://localhost:5000/api`

## Table of Contents
- [Authentication](#authentication)
- [Employees](#employees)
- [Departments](#departments)
- [Performance Reviews](#performance-reviews)
- [Error Handling](#error-handling)

---

## Authentication

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee" // "admin", "manager", or "employee"
}
```

**Response (201):**
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "employeeId": "64xyz789...",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

## Employees

### Get All Employees
```http
GET /api/employees
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive, on-leave, terminated)
- `department` (optional): Filter by department ID
- `search` (optional): Search by name or email

**Example:**
```http
GET /api/employees?status=active&department=64abc123
```

**Response (200):**
```json
[
  {
    "_id": "64abc123...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "position": "Software Engineer",
    "department": {
      "_id": "64def456...",
      "name": "IT Department",
      "code": "IT"
    },
    "dateOfJoining": "2023-01-15T00:00:00.000Z",
    "salary": 75000,
    "status": "active",
    "manager": {
      "_id": "64xyz789...",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "createdAt": "2023-01-15T10:00:00.000Z",
    "updatedAt": "2023-01-15T10:00:00.000Z"
  }
]
```

### Get Employee by ID
```http
GET /api/employees/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "64abc123...",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "position": "Software Engineer",
  "department": {
    "_id": "64def456...",
    "name": "IT Department",
    "code": "IT",
    "description": "Information Technology Department"
  },
  "dateOfJoining": "2023-01-15T00:00:00.000Z",
  "dateOfBirth": "1990-05-20T00:00:00.000Z",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "salary": 75000,
  "manager": {
    "_id": "64xyz789...",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "position": "Engineering Manager"
  },
  "status": "active",
  "skills": ["JavaScript", "React", "Node.js"],
  "education": [
    {
      "degree": "Bachelor of Computer Science",
      "institution": "State University",
      "year": 2015
    }
  ],
  "emergencyContact": {
    "name": "Mary Doe",
    "relationship": "Spouse",
    "phone": "123-456-7891"
  },
  "createdAt": "2023-01-15T10:00:00.000Z",
  "updatedAt": "2023-01-15T10:00:00.000Z"
}
```

### Create Employee
```http
POST /api/employees
Authorization: Bearer {token}
Role: Admin or Manager
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "position": "Software Engineer",
  "department": "64def456...",
  "dateOfJoining": "2023-01-15",
  "dateOfBirth": "1990-05-20",
  "salary": 75000,
  "status": "active",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "manager": "64xyz789..."
}
```

**Response (201):**
```json
{
  "_id": "64abc123...",
  "firstName": "John",
  "lastName": "Doe",
  // ... (full employee object)
}
```

### Update Employee
```http
PUT /api/employees/:id
Authorization: Bearer {token}
Role: Admin or Manager
```

**Request Body:** (same as Create Employee)

**Response (200):** (updated employee object)

### Delete Employee
```http
DELETE /api/employees/:id
Authorization: Bearer {token}
Role: Admin or Manager
```

**Response (200):**
```json
{
  "message": "Employee removed successfully"
}
```

### Get Employee Statistics
```http
GET /api/employees/stats/overview
Authorization: Bearer {token}
Role: Admin or Manager
```

**Response (200):**
```json
{
  "totalEmployees": 150,
  "activeEmployees": 140,
  "inactiveEmployees": 5,
  "onLeave": 5,
  "departmentStats": [
    {
      "departmentName": "IT Department",
      "count": 45
    },
    {
      "departmentName": "Sales",
      "count": 35
    }
  ]
}
```

---

## Departments

### Get All Departments
```http
GET /api/departments
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive)

**Response (200):**
```json
[
  {
    "_id": "64def456...",
    "name": "IT Department",
    "code": "IT",
    "description": "Information Technology Department",
    "head": {
      "_id": "64xyz789...",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com"
    },
    "budget": 500000,
    "location": "Building A, Floor 3",
    "status": "active",
    "createdAt": "2023-01-01T10:00:00.000Z",
    "updatedAt": "2023-01-01T10:00:00.000Z"
  }
]
```

### Get Department by ID
```http
GET /api/departments/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "64def456...",
  "name": "IT Department",
  "code": "IT",
  "description": "Information Technology Department",
  "head": {
    "_id": "64xyz789...",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "position": "Engineering Manager"
  },
  "budget": 500000,
  "location": "Building A, Floor 3",
  "status": "active",
  "employeeCount": 45,
  "createdAt": "2023-01-01T10:00:00.000Z",
  "updatedAt": "2023-01-01T10:00:00.000Z"
}
```

### Create Department
```http
POST /api/departments
Authorization: Bearer {token}
Role: Admin or Manager
```

**Request Body:**
```json
{
  "name": "IT Department",
  "code": "IT",
  "description": "Information Technology Department",
  "head": "64xyz789...",
  "budget": 500000,
  "location": "Building A, Floor 3",
  "status": "active"
}
```

**Response (201):** (created department object)

### Update Department
```http
PUT /api/departments/:id
Authorization: Bearer {token}
Role: Admin or Manager
```

**Request Body:** (same as Create Department)

**Response (200):** (updated department object)

### Delete Department
```http
DELETE /api/departments/:id
Authorization: Bearer {token}
Role: Admin or Manager
```

**Response (200):**
```json
{
  "message": "Department removed successfully"
}
```

**Error (400):**
```json
{
  "message": "Cannot delete department. It has 45 employee(s) assigned."
}
```

---

## Performance Reviews

### Get All Performance Reviews
```http
GET /api/performance
Authorization: Bearer {token}
Role: Admin or Manager
```

**Query Parameters:**
- `status` (optional): Filter by status (draft, submitted, reviewed, acknowledged)
- `employee` (optional): Filter by employee ID

**Response (200):**
```json
[
  {
    "_id": "64ghi789...",
    "employee": {
      "_id": "64abc123...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "position": "Software Engineer"
    },
    "reviewer": {
      "_id": "64xyz789...",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "reviewPeriod": {
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-03-31T00:00:00.000Z"
    },
    "overallRating": 4.5,
    "status": "reviewed",
    "createdAt": "2023-04-05T10:00:00.000Z",
    "updatedAt": "2023-04-05T10:00:00.000Z"
  }
]
```

### Get Performance Reviews for Employee
```http
GET /api/performance/employee/:employeeId
Authorization: Bearer {token}
```

**Response (200):** (array of performance reviews)

### Get Performance Review by ID
```http
GET /api/performance/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "64ghi789...",
  "employee": {
    "_id": "64abc123...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "position": "Software Engineer",
    "department": "IT Department"
  },
  "reviewer": {
    "_id": "64xyz789...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "manager"
  },
  "reviewPeriod": {
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-03-31T00:00:00.000Z"
  },
  "overallRating": 4.5,
  "categories": [
    {
      "name": "Technical Skills",
      "rating": 5,
      "comments": "Excellent coding skills and problem-solving abilities"
    },
    {
      "name": "Communication",
      "rating": 4,
      "comments": "Good communication with team members"
    }
  ],
  "strengths": [
    "Strong technical expertise",
    "Quick learner",
    "Team player"
  ],
  "areasForImprovement": [
    "Time management",
    "Documentation"
  ],
  "goals": [
    {
      "description": "Complete advanced React training",
      "targetDate": "2023-06-30T00:00:00.000Z",
      "status": "in-progress"
    },
    {
      "description": "Lead a small project",
      "targetDate": "2023-08-31T00:00:00.000Z",
      "status": "not-started"
    }
  ],
  "achievements": [
    "Successfully delivered Project X",
    "Mentored 2 junior developers"
  ],
  "comments": "John has shown great progress this quarter...",
  "employeeFeedback": "I appreciate the feedback and will work on...",
  "status": "reviewed",
  "createdAt": "2023-04-05T10:00:00.000Z",
  "updatedAt": "2023-04-05T10:00:00.000Z"
}
```

### Create Performance Review
```http
POST /api/performance
Authorization: Bearer {token}
Role: Admin or Manager
```

**Request Body:**
```json
{
  "employee": "64abc123...",
  "reviewPeriod": {
    "startDate": "2023-01-01",
    "endDate": "2023-03-31"
  },
  "overallRating": 4.5,
  "categories": [
    {
      "name": "Technical Skills",
      "rating": 5,
      "comments": "Excellent coding skills"
    },
    {
      "name": "Communication",
      "rating": 4,
      "comments": "Good communication"
    }
  ],
  "strengths": [
    "Strong technical expertise",
    "Quick learner"
  ],
  "areasForImprovement": [
    "Time management"
  ],
  "goals": [
    {
      "description": "Complete React training",
      "targetDate": "2023-06-30",
      "status": "not-started"
    }
  ],
  "achievements": [
    "Delivered Project X"
  ],
  "comments": "Excellent performance this quarter",
  "status": "reviewed"
}
```

**Response (201):** (created review object)

### Update Performance Review
```http
PUT /api/performance/:id
Authorization: Bearer {token}
Role: Admin or Manager
```

**Request Body:** (same as Create Performance Review)

**Response (200):** (updated review object)

### Delete Performance Review
```http
DELETE /api/performance/:id
Authorization: Bearer {token}
Role: Admin or Manager
```

**Response (200):**
```json
{
  "message": "Performance review removed successfully"
}
```

### Get Performance Statistics
```http
GET /api/performance/stats/overview
Authorization: Bearer {token}
Role: Admin or Manager
```

**Response (200):**
```json
{
  "totalReviews": 150,
  "averageRating": "4.25",
  "ratingDistribution": [
    { "_id": 5, "count": 45 },
    { "_id": 4, "count": 60 },
    { "_id": 3, "count": 35 },
    { "_id": 2, "count": 8 },
    { "_id": 1, "count": 2 }
  ],
  "statusDistribution": [
    { "_id": "reviewed", "count": 100 },
    { "_id": "draft", "count": 30 },
    { "_id": "submitted", "count": 20 }
  ]
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "msg": "Detailed error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

### Common HTTP Status Codes

- **200 OK**: Successful GET, PUT, DELETE request
- **201 Created**: Successful POST request
- **400 Bad Request**: Validation error or invalid data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Example Error Responses

**401 Unauthorized:**
```json
{
  "message": "Not authorized, no token"
}
```

**400 Validation Error:**
```json
{
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 6 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied. Admin or Manager only."
}
```

**404 Not Found:**
```json
{
  "message": "Employee not found"
}
```

**500 Server Error:**
```json
{
  "message": "Server error",
  "error": "Detailed error message (in development mode)"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting using packages like `express-rate-limit`.

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires after 30 days. After expiration, the user must log in again.

---

## Testing with Postman

1. **Register/Login** to get a token
2. **Add token to Postman**:
   - Go to Authorization tab
   - Select "Bearer Token"
   - Paste your token
3. **Make requests** to protected endpoints

---

## Notes

- All dates are in ISO 8601 format
- Timestamps are in UTC
- Populate is used for referenced documents (department, manager, etc.)
- Soft delete is not implemented; records are permanently deleted
- Password is never returned in responses (select: false in schema)
- Email must be unique across all users and employees
