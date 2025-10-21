# Deployment Guide for Employee Management System

## Prerequisites for Deployment

- MongoDB Atlas account (already configured)
- Heroku account (for backend) or any Node.js hosting
- Vercel/Netlify account (for frontend) or any static hosting

---

## Option 1: Deploy to Heroku (Backend) + Vercel (Frontend)

### Backend Deployment to Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create employee-mgmt-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your_mongodb_atlas_connection_string"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set NODE_ENV="production"
   heroku config:set CLIENT_URL="https://your-frontend-url.vercel.app"
   ```

5. **Add Procfile** (already created if needed)
   Create a file named `Procfile` in root:
   ```
   web: node backend/server.js
   ```

6. **Deploy to Heroku**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Open Your App**
   ```bash
   heroku open
   ```

### Frontend Deployment to Vercel

1. **Update API URL**
   Create `client/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy**
   ```bash
   cd client
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `build`

---

## Option 2: Deploy to Railway (Full Stack)

1. **Sign up at [Railway.app](https://railway.app/)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add Environment Variables**
   - Go to project settings
   - Add all variables from `.env`

4. **Deploy**
   - Railway will automatically detect and deploy your Node.js app
   - Get your deployment URL

---

## Option 3: Deploy to Render (Full Stack)

### Backend on Render

1. **Go to [Render.com](https://render.com/)**
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: employee-mgmt-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
5. Add Environment Variables
6. Click "Create Web Service"

### Frontend on Render

1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL
5. Click "Create Static Site"

---

## Option 4: VPS Deployment (AWS, DigitalOcean, etc.)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### 2. Clone and Setup Project

```bash
cd /var/www
git clone your-repo-url employee-management
cd employee-management
npm install
cd client && npm install && npm run build
```

### 3. Configure Environment

```bash
# Create .env file
nano .env
# Add your environment variables
```

### 4. Start with PM2

```bash
pm2 start backend/server.js --name employee-api
pm2 startup
pm2 save
```

### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/employee-management
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/employee-management/client/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/employee-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables Required

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_management
JWT_SECRET=your_secure_random_string
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
```

### Frontend (client/.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas IP whitelist updated
- [ ] All environment variables set correctly
- [ ] Backend API responding at /api endpoint
- [ ] Frontend can communicate with backend
- [ ] CORS configured properly
- [ ] SSL certificate installed (HTTPS)
- [ ] Database backup strategy in place
- [ ] Monitoring and logging set up
- [ ] Create first admin user via /register endpoint
- [ ] Test all major features

---

## Monitoring and Maintenance

### MongoDB Atlas Monitoring
- Set up alerts for high memory/CPU usage
- Monitor connection pool usage
- Review slow query logs

### Application Monitoring
- Use PM2 monitoring for Node.js apps
- Set up application performance monitoring (APM)
- Configure error tracking (Sentry, LogRocket)

### Backup Strategy
- MongoDB Atlas automatic backups (included in paid tiers)
- Export important data regularly
- Test restore procedures

---

## Scaling Considerations

### Database
- MongoDB Atlas auto-scaling available
- Consider read replicas for high traffic
- Implement database indexes for performance

### Backend
- Use load balancer for multiple instances
- Implement Redis for session management
- Consider microservices architecture

### Frontend
- Use CDN for static assets
- Implement code splitting
- Enable Gzip compression

---

## Security Best Practices

1. **Never expose sensitive data**
   - Keep `.env` files secure
   - Use environment variables for all secrets

2. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Use libraries like `express-rate-limit`

3. **Input Validation**
   - Already implemented with express-validator
   - Sanitize all user inputs

4. **HTTPS Only**
   - Force HTTPS in production
   - Set secure cookie flags

5. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

6. **Database Security**
   - Use strong passwords
   - Restrict IP access
   - Enable encryption at rest

---

## Troubleshooting Common Issues

### Issue: Cannot connect to MongoDB
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string in environment variables
- Check network connectivity

### Issue: CORS errors
- Verify CLIENT_URL in backend .env
- Check REACT_APP_API_URL in frontend
- Ensure CORS middleware is configured

### Issue: 404 on routes
- Backend: Check if routes are properly imported
- Frontend: Ensure React Router is configured
- Check Nginx configuration for SPA routing

### Issue: Authentication not working
- Verify JWT_SECRET is same across deployments
- Check token expiration time
- Ensure localStorage is accessible

---

## Support and Resources

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Heroku Docs: https://devcenter.heroku.com/
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- PM2 Docs: https://pm2.keymetrics.io/
