const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Employee = require('./models/Employee');
const Department = require('./models/Department');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const sampleData = {
  departments: [
    {
      name: 'Engineering',
      description: 'Software development and technical operations',
      location: 'Bangalore, India',
      budget: 5000000
    },
    {
      name: 'Human Resources',
      description: 'Employee management and recruitment',
      location: 'Mumbai, India',
      budget: 1500000
    },
    {
      name: 'Sales & Marketing',
      description: 'Business development and customer relations',
      location: 'Delhi, India',
      budget: 3000000
    },
    {
      name: 'Finance',
      description: 'Financial planning and accounting',
      location: 'Pune, India',
      budget: 2000000
    },
    {
      name: 'Operations',
      description: 'Day-to-day business operations',
      location: 'Chennai, India',
      budget: 2500000
    }
  ],

  users: [
    // Admin
    {
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin'
    },
    // HR Users
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      password: 'hr123',
      role: 'hr'
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      password: 'hr123',
      role: 'hr'
    },
    // Managers
    {
      name: 'Amit Patel',
      email: 'amit.patel@company.com',
      password: 'manager123',
      role: 'manager'
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@company.com',
      password: 'manager123',
      role: 'manager'
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@company.com',
      password: 'manager123',
      role: 'manager'
    },
    {
      name: 'Kavita Desai',
      email: 'kavita.desai@company.com',
      password: 'manager123',
      role: 'manager'
    },
    {
      name: 'Arjun Nair',
      email: 'arjun.nair@company.com',
      password: 'manager123',
      role: 'manager'
    },
    // Employees
    {
      name: 'Rahul Verma',
      email: 'rahul.verma@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Anjali Gupta',
      email: 'anjali.gupta@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Suresh Patel',
      email: 'suresh.patel@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Deepa Iyer',
      email: 'deepa.iyer@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Karthik Reddy',
      email: 'karthik.reddy@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Meera Shah',
      email: 'meera.shah@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Naveen Kumar',
      email: 'naveen.kumar@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Pooja Menon',
      email: 'pooja.menon@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Sandeep Joshi',
      email: 'sandeep.joshi@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Divya Krishnan',
      email: 'divya.krishnan@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Arun Bose',
      email: 'arun.bose@company.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Lakshmi Rao',
      email: 'lakshmi.rao@company.com',
      password: 'employee123',
      role: 'employee'
    }
  ],

  employees: [
    // Engineering Department
    {
      employeeId: 'EMP001',
      name: 'Amit Patel',
      email: 'amit.patel@company.com',
      phone: '+91-9876543210',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'Male',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      position: 'Engineering Manager',
      departmentName: 'Engineering',
      joiningDate: new Date('2018-01-15'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 150000,
        allowances: {
          hra: 60000,
          ta: 15000,
          da: 10000,
          medicalAllowance: 5000
        },
        deductions: {
          pf: 18000,
          tax: 25000,
          insurance: 2000
        }
      },
      bankDetails: {
        accountNumber: '1234567890123456',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branch: 'MG Road, Bangalore'
      }
    },
    {
      employeeId: 'EMP002',
      name: 'Rahul Verma',
      email: 'rahul.verma@company.com',
      phone: '+91-9876543211',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'Male',
      address: '45 Brigade Road, Bangalore, Karnataka 560025',
      position: 'Senior Software Engineer',
      departmentName: 'Engineering',
      joiningDate: new Date('2019-06-01'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 100000,
        allowances: {
          hra: 40000,
          ta: 10000,
          da: 8000,
          medicalAllowance: 3000
        },
        deductions: {
          pf: 12000,
          tax: 15000,
          insurance: 1500
        }
      },
      bankDetails: {
        accountNumber: '2345678901234567',
        ifscCode: 'ICIC0002345',
        bankName: 'ICICI Bank',
        branch: 'Indiranagar, Bangalore'
      }
    },
    {
      employeeId: 'EMP003',
      name: 'Anjali Gupta',
      email: 'anjali.gupta@company.com',
      phone: '+91-9876543212',
      dateOfBirth: new Date('1992-11-08'),
      gender: 'Female',
      address: '78 Residency Road, Bangalore, Karnataka 560025',
      position: 'Software Engineer',
      departmentName: 'Engineering',
      joiningDate: new Date('2020-03-10'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 80000,
        allowances: {
          hra: 32000,
          ta: 8000,
          da: 6000,
          medicalAllowance: 2500
        },
        deductions: {
          pf: 9600,
          tax: 10000,
          insurance: 1200
        }
      },
      bankDetails: {
        accountNumber: '3456789012345678',
        ifscCode: 'SBI0003456',
        bankName: 'State Bank of India',
        branch: 'Koramangala, Bangalore'
      }
    },
    {
      employeeId: 'EMP004',
      name: 'Karthik Reddy',
      email: 'karthik.reddy@company.com',
      phone: '+91-9876543213',
      dateOfBirth: new Date('1991-05-18'),
      gender: 'Male',
      address: '22 Whitefield Road, Bangalore, Karnataka 560066',
      position: 'DevOps Engineer',
      departmentName: 'Engineering',
      joiningDate: new Date('2019-09-15'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 95000,
        allowances: {
          hra: 38000,
          ta: 9500,
          da: 7000,
          medicalAllowance: 3000
        },
        deductions: {
          pf: 11400,
          tax: 13000,
          insurance: 1400
        }
      },
      bankDetails: {
        accountNumber: '4567890123456789',
        ifscCode: 'AXIS0004567',
        bankName: 'Axis Bank',
        branch: 'Whitefield, Bangalore'
      }
    },

    // HR Department
    {
      employeeId: 'EMP005',
      name: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      phone: '+91-9876543214',
      dateOfBirth: new Date('1987-09-12'),
      gender: 'Female',
      address: '56 Nariman Point, Mumbai, Maharashtra 400021',
      position: 'HR Manager',
      departmentName: 'Human Resources',
      joiningDate: new Date('2017-04-01'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 120000,
        allowances: {
          hra: 48000,
          ta: 12000,
          da: 9000,
          medicalAllowance: 4000
        },
        deductions: {
          pf: 14400,
          tax: 18000,
          insurance: 1800
        }
      },
      bankDetails: {
        accountNumber: '5678901234567890',
        ifscCode: 'HDFC0005678',
        bankName: 'HDFC Bank',
        branch: 'Nariman Point, Mumbai'
      }
    },
    {
      employeeId: 'EMP006',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@company.com',
      phone: '+91-9876543215',
      dateOfBirth: new Date('1988-02-28'),
      gender: 'Male',
      address: '89 Bandra West, Mumbai, Maharashtra 400050',
      position: 'HR Executive',
      departmentName: 'Human Resources',
      joiningDate: new Date('2018-08-20'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 75000,
        allowances: {
          hra: 30000,
          ta: 7500,
          da: 5500,
          medicalAllowance: 2500
        },
        deductions: {
          pf: 9000,
          tax: 9000,
          insurance: 1200
        }
      },
      bankDetails: {
        accountNumber: '6789012345678901',
        ifscCode: 'ICIC0006789',
        bankName: 'ICICI Bank',
        branch: 'Bandra, Mumbai'
      }
    },
    {
      employeeId: 'EMP007',
      name: 'Meera Shah',
      email: 'meera.shah@company.com',
      phone: '+91-9876543216',
      dateOfBirth: new Date('1993-06-14'),
      gender: 'Female',
      address: '34 Juhu Beach Road, Mumbai, Maharashtra 400049',
      position: 'Recruitment Specialist',
      departmentName: 'Human Resources',
      joiningDate: new Date('2020-11-05'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 65000,
        allowances: {
          hra: 26000,
          ta: 6500,
          da: 5000,
          medicalAllowance: 2000
        },
        deductions: {
          pf: 7800,
          tax: 7500,
          insurance: 1000
        }
      },
      bankDetails: {
        accountNumber: '7890123456789012',
        ifscCode: 'SBI0007890',
        bankName: 'State Bank of India',
        branch: 'Juhu, Mumbai'
      }
    },

    // Sales & Marketing
    {
      employeeId: 'EMP008',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@company.com',
      phone: '+91-9876543217',
      dateOfBirth: new Date('1986-12-05'),
      gender: 'Female',
      address: '67 Connaught Place, Delhi 110001',
      position: 'Sales Manager',
      departmentName: 'Sales & Marketing',
      joiningDate: new Date('2016-07-10'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 130000,
        allowances: {
          hra: 52000,
          ta: 13000,
          da: 10000,
          medicalAllowance: 4500
        },
        deductions: {
          pf: 15600,
          tax: 20000,
          insurance: 2000
        }
      },
      bankDetails: {
        accountNumber: '8901234567890123',
        ifscCode: 'HDFC0008901',
        bankName: 'HDFC Bank',
        branch: 'Connaught Place, Delhi'
      }
    },
    {
      employeeId: 'EMP009',
      name: 'Suresh Patel',
      email: 'suresh.patel@company.com',
      phone: '+91-9876543218',
      dateOfBirth: new Date('1989-04-20'),
      gender: 'Male',
      address: '12 Karol Bagh, Delhi 110005',
      position: 'Sales Executive',
      departmentName: 'Sales & Marketing',
      joiningDate: new Date('2019-02-15'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 70000,
        allowances: {
          hra: 28000,
          ta: 7000,
          da: 5500,
          medicalAllowance: 2500
        },
        deductions: {
          pf: 8400,
          tax: 8500,
          insurance: 1200
        }
      },
      bankDetails: {
        accountNumber: '9012345678901234',
        ifscCode: 'AXIS0009012',
        bankName: 'Axis Bank',
        branch: 'Karol Bagh, Delhi'
      }
    },
    {
      employeeId: 'EMP010',
      name: 'Deepa Iyer',
      email: 'deepa.iyer@company.com',
      phone: '+91-9876543219',
      dateOfBirth: new Date('1991-08-30'),
      gender: 'Female',
      address: '45 Nehru Place, Delhi 110019',
      position: 'Marketing Specialist',
      departmentName: 'Sales & Marketing',
      joiningDate: new Date('2020-05-01'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 72000,
        allowances: {
          hra: 28800,
          ta: 7200,
          da: 5500,
          medicalAllowance: 2500
        },
        deductions: {
          pf: 8640,
          tax: 8800,
          insurance: 1200
        }
      },
      bankDetails: {
        accountNumber: '0123456789012345',
        ifscCode: 'ICIC0001234',
        bankName: 'ICICI Bank',
        branch: 'Nehru Place, Delhi'
      }
    },

    // Finance Department
    {
      employeeId: 'EMP011',
      name: 'Vikram Singh',
      email: 'vikram.singh@company.com',
      phone: '+91-9876543220',
      dateOfBirth: new Date('1984-10-25'),
      gender: 'Male',
      address: '88 Shivaji Nagar, Pune, Maharashtra 411005',
      position: 'Finance Manager',
      departmentName: 'Finance',
      joiningDate: new Date('2015-03-20'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 140000,
        allowances: {
          hra: 56000,
          ta: 14000,
          da: 10000,
          medicalAllowance: 5000
        },
        deductions: {
          pf: 16800,
          tax: 22000,
          insurance: 2000
        }
      },
      bankDetails: {
        accountNumber: '1234567890987654',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branch: 'Shivaji Nagar, Pune'
      }
    },
    {
      employeeId: 'EMP012',
      name: 'Naveen Kumar',
      email: 'naveen.kumar@company.com',
      phone: '+91-9876543221',
      dateOfBirth: new Date('1990-01-12'),
      gender: 'Male',
      address: '23 Camp Area, Pune, Maharashtra 411001',
      position: 'Senior Accountant',
      departmentName: 'Finance',
      joiningDate: new Date('2018-09-10'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 85000,
        allowances: {
          hra: 34000,
          ta: 8500,
          da: 6500,
          medicalAllowance: 3000
        },
        deductions: {
          pf: 10200,
          tax: 11000,
          insurance: 1400
        }
      },
      bankDetails: {
        accountNumber: '2345678901987654',
        ifscCode: 'SBI0002345',
        bankName: 'State Bank of India',
        branch: 'Camp, Pune'
      }
    },
    {
      employeeId: 'EMP013',
      name: 'Pooja Menon',
      email: 'pooja.menon@company.com',
      phone: '+91-9876543222',
      dateOfBirth: new Date('1992-03-27'),
      gender: 'Female',
      address: '56 Koregaon Park, Pune, Maharashtra 411001',
      position: 'Financial Analyst',
      departmentName: 'Finance',
      joiningDate: new Date('2019-12-01'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 78000,
        allowances: {
          hra: 31200,
          ta: 7800,
          da: 6000,
          medicalAllowance: 2500
        },
        deductions: {
          pf: 9360,
          tax: 9500,
          insurance: 1300
        }
      },
      bankDetails: {
        accountNumber: '3456789012987654',
        ifscCode: 'AXIS0003456',
        bankName: 'Axis Bank',
        branch: 'Koregaon Park, Pune'
      }
    },

    // Operations Department
    {
      employeeId: 'EMP014',
      name: 'Kavita Desai',
      email: 'kavita.desai@company.com',
      phone: '+91-9876543223',
      dateOfBirth: new Date('1987-07-08'),
      gender: 'Female',
      address: '90 T Nagar, Chennai, Tamil Nadu 600017',
      position: 'Operations Manager',
      departmentName: 'Operations',
      joiningDate: new Date('2016-11-15'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 125000,
        allowances: {
          hra: 50000,
          ta: 12500,
          da: 9500,
          medicalAllowance: 4000
        },
        deductions: {
          pf: 15000,
          tax: 19000,
          insurance: 1800
        }
      },
      bankDetails: {
        accountNumber: '4567890123987654',
        ifscCode: 'HDFC0004567',
        bankName: 'HDFC Bank',
        branch: 'T Nagar, Chennai'
      }
    },
    {
      employeeId: 'EMP015',
      name: 'Arjun Nair',
      email: 'arjun.nair@company.com',
      phone: '+91-9876543224',
      dateOfBirth: new Date('1988-11-19'),
      gender: 'Male',
      address: '34 Anna Nagar, Chennai, Tamil Nadu 600040',
      position: 'Operations Coordinator',
      departmentName: 'Operations',
      joiningDate: new Date('2017-05-20'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 82000,
        allowances: {
          hra: 32800,
          ta: 8200,
          da: 6500,
          medicalAllowance: 2800
        },
        deductions: {
          pf: 9840,
          tax: 10500,
          insurance: 1400
        }
      },
      bankDetails: {
        accountNumber: '5678901234987654',
        ifscCode: 'ICIC0005678',
        bankName: 'ICICI Bank',
        branch: 'Anna Nagar, Chennai'
      }
    },
    {
      employeeId: 'EMP016',
      name: 'Sandeep Joshi',
      email: 'sandeep.joshi@company.com',
      phone: '+91-9876543225',
      dateOfBirth: new Date('1990-09-03'),
      gender: 'Male',
      address: '67 Velachery, Chennai, Tamil Nadu 600042',
      position: 'Logistics Specialist',
      departmentName: 'Operations',
      joiningDate: new Date('2019-07-01'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 68000,
        allowances: {
          hra: 27200,
          ta: 6800,
          da: 5200,
          medicalAllowance: 2300
        },
        deductions: {
          pf: 8160,
          tax: 8000,
          insurance: 1100
        }
      },
      bankDetails: {
        accountNumber: '6789012345987654',
        ifscCode: 'SBI0006789',
        bankName: 'State Bank of India',
        branch: 'Velachery, Chennai'
      }
    },
    {
      employeeId: 'EMP017',
      name: 'Divya Krishnan',
      email: 'divya.krishnan@company.com',
      phone: '+91-9876543226',
      dateOfBirth: new Date('1993-12-15'),
      gender: 'Female',
      address: '12 Adyar, Chennai, Tamil Nadu 600020',
      position: 'Operations Assistant',
      departmentName: 'Operations',
      joiningDate: new Date('2021-01-10'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 55000,
        allowances: {
          hra: 22000,
          ta: 5500,
          da: 4200,
          medicalAllowance: 2000
        },
        deductions: {
          pf: 6600,
          tax: 6000,
          insurance: 900
        }
      },
      bankDetails: {
        accountNumber: '7890123456987654',
        ifscCode: 'AXIS0007890',
        bankName: 'Axis Bank',
        branch: 'Adyar, Chennai'
      }
    },
    {
      employeeId: 'EMP018',
      name: 'Arun Bose',
      email: 'arun.bose@company.com',
      phone: '+91-9876543227',
      dateOfBirth: new Date('1991-04-22'),
      gender: 'Male',
      address: '78 OMR Road, Chennai, Tamil Nadu 600097',
      position: 'Process Executive',
      departmentName: 'Operations',
      joiningDate: new Date('2020-08-15'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 62000,
        allowances: {
          hra: 24800,
          ta: 6200,
          da: 4800,
          medicalAllowance: 2200
        },
        deductions: {
          pf: 7440,
          tax: 7200,
          insurance: 1000
        }
      },
      bankDetails: {
        accountNumber: '8901234567987654',
        ifscCode: 'HDFC0008901',
        bankName: 'HDFC Bank',
        branch: 'OMR, Chennai'
      }
    },
    {
      employeeId: 'EMP019',
      name: 'Lakshmi Rao',
      email: 'lakshmi.rao@company.com',
      phone: '+91-9876543228',
      dateOfBirth: new Date('1994-06-18'),
      gender: 'Female',
      address: '45 Mylapore, Chennai, Tamil Nadu 600004',
      position: 'Quality Analyst',
      departmentName: 'Operations',
      joiningDate: new Date('2021-03-22'),
      employmentStatus: 'Active',
      salary: {
        basicSalary: 58000,
        allowances: {
          hra: 23200,
          ta: 5800,
          da: 4400,
          medicalAllowance: 2100
        },
        deductions: {
          pf: 6960,
          tax: 6500,
          insurance: 950
        }
      },
      bankDetails: {
        accountNumber: '9012345678987654',
        ifscCode: 'ICIC0009012',
        bankName: 'ICICI Bank',
        branch: 'Mylapore, Chennai'
      }
    }
  ]
};

async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log(`⚠️  Database already contains ${existingUsers} users.`);
      console.log('Do you want to clear and reseed? This will DELETE all existing data!');
      console.log('To proceed, manually delete data from MongoDB or uncomment the clear lines below.\n');
      process.exit(0);
    }

    console.log('🌱 Starting database seeding...\n');

    // Seed Departments
    console.log('📁 Creating departments...');
    const departments = await Department.insertMany(sampleData.departments);
    console.log(`✅ Created ${departments.length} departments\n`);

    // Seed Users with hashed passwords
    console.log('👤 Creating users...');
    const usersWithHashedPasswords = await Promise.all(
      sampleData.users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${users.length} users\n`);

    // Create a map of email to user ID
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user._id;
    });

    // Create a map of department name to department ID
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept.name] = dept._id;
    });

    // Seed Employees with references
    console.log('👥 Creating employees...');
    const employeesWithRefs = sampleData.employees.map(emp => {
      const employee = { ...emp };
      employee.user = userMap[emp.email];
      employee.department = deptMap[emp.departmentName];
      
      // Set manager for non-manager employees
      if (!sampleData.users.find(u => u.email === emp.email && u.role === 'manager')) {
        // Find a manager in the same department
        const deptManager = sampleData.employees.find(e => 
          e.departmentName === emp.departmentName && 
          sampleData.users.find(u => u.email === e.email && u.role === 'manager')
        );
        if (deptManager) {
          employee.manager = userMap[deptManager.email];
        }
      }
      
      delete employee.departmentName;
      return employee;
    });

    const employees = await Employee.insertMany(employeesWithRefs);
    console.log(`✅ Created ${employees.length} employees\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Employees: ${employees.length}\n`);
    
    console.log('🔐 Login Credentials:');
    console.log('   Admin:    admin@company.com / admin123');
    console.log('   HR:       priya.sharma@company.com / hr123');
    console.log('   Manager:  amit.patel@company.com / manager123');
    console.log('   Employee: rahul.verma@company.com / employee123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
