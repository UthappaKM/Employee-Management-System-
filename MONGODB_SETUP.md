# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in if you already have one
3. Create a new project (e.g., "Employee Management")

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region (choose one closest to you)
4. Click "Create Cluster" (this may take a few minutes)

## Step 3: Configure Database Access

1. In the left sidebar, click "Database Access" under Security
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Enter a username (e.g., `admin`)
5. Click "Autogenerate Secure Password" or create your own
6. **IMPORTANT**: Save the username and password - you'll need them for the connection string
7. Under "Database User Privileges", select "Atlas admin"
8. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access" under Security
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IP addresses
4. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Database" in the left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver and latest version
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update .env File

1. Open the `.env` file in your project root
2. Replace the `MONGO_URI` value with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Add the database name before the `?` like this:
   ```
   mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/employee_management?retryWrites=true&w=majority
   ```

## Example .env Configuration

```env
MONGO_URI=mongodb+srv://admin:MyPassword123@cluster0.abcde.mongodb.net/employee_management?retryWrites=true&w=majority
JWT_SECRET=my_secure_jwt_secret_key_2024
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Step 7: Test Connection

After setting up your `.env` file:

1. Make sure you're in the project root directory
2. Run `npm install` to install dependencies
3. Run `npm run server` to start the backend
4. You should see: "MongoDB Atlas Connected: cluster0-shard-00-00.xxxxx.mongodb.net"

## Troubleshooting

### Connection Timeout
- Check if your IP address is whitelisted in Network Access
- Verify your username and password are correct
- Make sure there are no special characters that need encoding in your password

### Authentication Failed
- Double-check your username and password
- Make sure the user has proper privileges (Atlas admin)

### Database Name
- The database will be created automatically when you first add data
- Make sure the database name doesn't contain special characters or spaces

## Security Notes for Production

1. **Never commit .env file to version control**
2. Use environment-specific passwords
3. Restrict IP addresses to your server's IP only
4. Use a strong, randomly generated JWT_SECRET
5. Enable database auditing and monitoring
6. Regularly rotate database credentials
7. Use connection string encryption
