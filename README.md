--- README.md (原始)
# 🚐 SurangaTours - Travel & Tour Management System

<div align="center">

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-ISC-blue)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)

**Your Complete Solution for Modern Tour Management**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Configuration](#-configuration) • [API Reference](#-api-reference) • [Deployment](#-deployment)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Security Features](#-security-features)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Support](#-support)

---

## 🌟 Overview

**SurangaTours** is a comprehensive full-stack web application designed to revolutionize tour and travel management. Built with modern technologies, it provides a seamless experience for tourists, drivers, administrators, and payment processing.

The platform enables:
- 🧑‍💼 **Tourists** to browse destinations, book trips, and manage payments
- 🚗 **Drivers** to view assignments and manage schedules
- 👨‍💼 **Administrators** to oversee operations, manage users, and monitor bookings
- 💳 **Payment Center** for secure transaction processing
- 🤖 **AI Integration** for enhanced user experiences

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ Secure user registration and login with JWT authentication
- ✅ Google reCAPTCHA v2 integration for bot protection
- ✅ Role-based access control (Admin, Driver, Tourist)
- ✅ Password reset functionality with email verification
- ✅ Protected routes and middleware security

### 🎯 User Management
- 👤 User profile management
- 🎭 Multi-role support (Admin, Driver, Tourist)
- 📧 Email verification system
- 🔑 Secure password hashing with bcryptjs

### 🏞️ Destination & Trip Management
- 🗺️ Browse and search destinations
- 📅 Create and manage trip schedules
- 🏷️ Categorize trips by destination
- ⭐ Review and rating system

### 🚌 Fleet Management
- 🚐 Vehicle inventory management
- 🔧 Vehicle maintenance tracking
- 📊 Capacity and availability monitoring

### 📦 Booking System
- 🎫 Real-time booking creation and management
- 📋 Booking status tracking
- 🔔 Notification system
- 📝 Booking history and records

### 💰 Payment Processing
- 💳 Secure payment gateway integration
- 🧾 Invoice generation
- 💵 Multiple payment methods support
- 📊 Payment status tracking

### 🤖 AI Integration
- 🧠 Google Generative AI integration
- 💬 Intelligent chatbot assistance
- 📝 Automated content generation
- 🔍 Smart recommendations

### 📊 Admin Dashboard
- 📈 Analytics and reporting
- 👥 User management
- 🚗 Driver assignment
- 📋 Booking oversight
- 🏞️ Destination management

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Public  │  │   User   │  │  Driver  │  │  Admin   │   │
│  │  Pages   │  │Dashboard │  │Dashboard │  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controllers│  │Middleware│  │ Services │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              External Integrations                    │  │
│  │  Google AI │ reCAPTCHA │ Nodemailer │ Payment APIs   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Sequelize ORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MySQL)                          │
│  Users │ Drivers │ Bookings │ Trips │ Vehicles │ Payments  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react) | 19.2.4 | UI Library |
| ![React Router](https://img.shields.io/badge/React_Router-7.13.1-ca4245?logo=react-router) | 7.13.1 | Routing |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-38B2AC?logo=tailwind-css) | 4.2.1 | Styling |
| ![Axios](https://img.shields.io/badge/Axios-1.13.6-5A29E4?logo=axios) | 1.13.6 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) | Latest | Runtime & Framework |
| ![Sequelize](https://img.shields.io/badge/Sequelize-6.37.7-52B0E7?logo=sequelize) | 6.37.7 | ORM |
| ![MySQL](https://img.shields.io/badge/MySQL-2-4479A1?logo=mysql) | 3.18.2 | Database Driver |
| ![JWT](https://img.shields.io/badge/JWT-9.0.3-000000?logo=json-web-tokens) | 9.0.3 | Authentication |
| ![bcryptjs](https://img.shields.io/badge/bcryptjs-3.0.3-FF6F00?logo=bcrypt) | 3.0.3 | Password Hashing |

### External Services
- 🤖 **Google Generative AI** - AI-powered features
- 🔒 **Google reCAPTCHA v2** - Bot protection
- 📧 **Nodemailer** - Email services
- 💳 **Payment Gateway** - Transaction processing

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| ![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.x-339933?logo=node.js) | 18.x | [Download](https://nodejs.org/) |
| ![npm](https://img.shields.io/badge/npm-%3E%3D9.x-CB3837?logo=npm) | 9.x | Included with Node.js |
| ![MySQL](https://img.shields.io/badge/MySQL-%3E%3D8.0-4479A1?logo=mysql) | 8.0 | [Download](https://dev.mysql.com/downloads/) |
| Git | Latest | [Download](https://git-scm.com/) |

### Required Accounts
- 📧 **Email Service** - For sending verification emails (Gmail, SendGrid, etc.)
- 🔑 **Google reCAPTCHA Keys** - [Get keys here](https://www.google.com/recaptcha/admin)
- 🤖 **Google AI API Key** - [Get API key](https://makersuite.google.com/app/apikey)
- 💳 **Payment Gateway Credentials** - Depending on your provider

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd SurangaTours
```

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

### Step 4: Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE surangatours;
```

2. **Create Database User (Optional but Recommended):**
```sql
CREATE USER 'surangatours_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON surangatours.* TO 'surangatours_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## ⚙️ Configuration

### Server Configuration

Create a `.env` file in the `/server` directory:

```bash
# Server Environment Variables
PORT=5000

# Database Configuration
DB_NAME=surangatours
DB_USER=root
DB_PASS=your_database_password
DB_HOST=localhost

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Google reCAPTCHA
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=SurangaTours <noreply@surangatours.com>

# Payment Gateway (Example - Update based on your provider)
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_SECRET=your_payment_secret

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### Client Configuration

Create a `.env` file in the `/client` directory:

```bash
# Client Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

> ⚠️ **Security Warning**: Never commit `.env` files to version control! They are already included in `.gitignore`.

---

## ▶️ Running the Application

### Development Mode

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
✅ MySQL Database connected successfully.
🚀 Server running on port 5000
```

#### Terminal 2 - Start Frontend Client

```bash
cd client
npm start
```

Expected output:
```
Compiled successfully!
You can now view SurangaTours in the browser.

Local:            http://localhost:3000
```

### Production Mode

#### Build Client

```bash
cd client
npm run build
```

#### Start Server

```bash
cd server
npm start
```

---

## 📁 Project Structure

```
SurangaTours/
├── client/                     # React Frontend
│   ├── public/
│   │   └── index.html         # HTML template with reCAPTCHA script
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── common/
│   │   │       └── ProtectedRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── auth/          # Authentication pages
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── ForgotPasswordPage.jsx
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── user/          # User dashboard pages
│   │   │   ├── driver/        # Driver dashboard pages
│   │   │   ├── payment/       # Payment pages
│   │   │   └── destinations/  # Destination pages
│   │   ├── App.js             # Main app component with routing
│   │   ├── App.css            # Global styles
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── .env
│
├── server/                     # Express Backend
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── userController.js
│   │   ├── driverController.js
│   │   ├── bookingController.js
│   │   ├── tripController.js
│   │   ├── destinationController.js
│   │   ├── vehicleController.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   └── aiController.js
│   ├── middleware/            # Custom middleware
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Driver.js
│   │   ├── Booking.js
│   │   ├── Trip.js
│   │   ├── Destination.js
│   │   ├── Vehicle.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   ├── VerificationCode.js
│   │   ├── UserFavorite.js
│   │   └── index.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── userRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── aiRoutes.js
│   ├── services/              # External service integrations
│   ├── uploads/               # File upload directory
│   ├── index.js               # Server entry point
│   ├── package.json
│   └── .env
│
├── RECAPTCHA_IMPLEMENTATION.md # Detailed reCAPTCHA guide
└── README.md                   # This file
```

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | ✅ |
| PUT | `/users/profile` | Update user profile | ✅ |
| GET | `/users/bookings` | Get user bookings | ✅ |
| PUT | `/users/password` | Change password | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/users` | Get all users | ✅ Admin |
| PUT | `/admin/users/:id` | Update user | ✅ Admin |
| DELETE | `/admin/users/:id` | Delete user | ✅ Admin |
| GET | `/admin/bookings` | Get all bookings | ✅ Admin |
| GET | `/admin/drivers` | Manage drivers | ✅ Admin |
| GET | `/admin/destinations` | Manage destinations | ✅ Admin |

### Driver Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/drivers/profile` | Get driver profile | ✅ Driver |
| PUT | `/drivers/profile` | Update driver profile | ✅ Driver |
| GET | `/drivers/trips` | Get assigned trips | ✅ Driver |
| PUT | `/drivers/status` | Update availability | ✅ Driver |

### Trip & Destination Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/destinations` | Get all destinations | ❌ |
| GET | `/destinations/:id` | Get destination details | ❌ |
| POST | `/destinations` | Create destination | ✅ Admin |
| GET | `/trips` | Get all trips | ❌ |
| GET | `/trips/:id` | Get trip details | ❌ |
| POST | `/trips` | Create trip | ✅ Admin |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bookings` | Create booking | ✅ |
| GET | `/bookings/:id` | Get booking details | ✅ |
| PUT | `/bookings/:id` | Update booking | ✅ |
| DELETE | `/bookings/:id` | Cancel booking | ✅ |
| GET | `/bookings/user/:userId` | Get user bookings | ✅ |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/create` | Create payment | ✅ |
| GET | `/payments/:bookingId` | Get payment details | ✅ |
| PUT | `/payments/:id/confirm` | Confirm payment | ✅ |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reviews` | Create review | ✅ |
| GET | `/reviews/trip/:tripId` | Get trip reviews | ❌ |
| PUT | `/reviews/:id` | Update review | ✅ |
| DELETE | `/reviews/:id` | Delete review | ✅ |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/chat` | Chat with AI assistant | ✅ |
| POST | `/ai/recommend` | Get AI recommendations | ✅ |

### Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload/image` | Upload image | ✅ |
| POST | `/upload/document` | Upload document | ✅ |

---

## 👥 User Roles

### 🧑‍💼 Tourist (User)
- Browse destinations and trips
- Create and manage bookings
- Make payments
- Submit reviews
- Manage profile
- View booking history

### 🚗 Driver
- View assigned trips
- Update trip status
- Manage availability
- Update profile
- View schedule

### 👨‍💼 Admin
- Full system access
- Manage all users
- Manage drivers and vehicles
- Create/edit/delete destinations and trips
- Oversee all bookings
- Monitor payments
- View analytics

---

## 🔒 Security Features

### Implemented Security Measures

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **JWT Authentication** | Secure token-based auth | ✅ |
| 🔒 **Password Hashing** | bcryptjs with salt rounds | ✅ |
| 🤖 **reCAPTCHA v2** | Bot protection on auth forms | ✅ |
| 🛡️ **CORS Protection** | Configured allowed origins | ✅ |
| 🔑 **Environment Variables** | Sensitive data protected | ✅ |
| 🚫 **SQL Injection Prevention** | Sequelize ORM parameterization | ✅ |
| 🔐 **Role-Based Access** | Middleware role verification | ✅ |
| 📧 **Email Verification** | Password reset verification | ✅ |
| ⏰ **Token Expiration** | JWT tokens expire after 7 days | ✅ |

### Best Practices Followed

- ✅ Secret keys never exposed in frontend code
- ✅ HTTPS required for production (reCAPTCHA requirement)
- ✅ Input validation on all endpoints
- ✅ Error messages don't leak sensitive information
- ✅ Rate limiting recommended for production

---

## 🧪 Testing

### Manual Testing Scenarios

#### Authentication Flow
1. ✅ Register new user with reCAPTCHA
2. ✅ Login with valid credentials
3. ✅ Test forgot password functionality
4. ✅ Verify reCAPTCHA prevents bot submissions

#### User Features
1. ✅ Browse destinations without login
2. ✅ Create booking as logged-in user
3. ✅ View booking history
4. ✅ Submit review after trip

#### Admin Features
1. ✅ Access admin dashboard (admin role only)
2. ✅ CRUD operations on destinations
3. ✅ Manage users and drivers
4. ✅ View all bookings

### API Testing with cURL

```bash
# Test Health Endpoint
curl http://localhost:5000

# Test Registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "tourist",
    "recaptchaToken": "token_from_recaptcha"
  }'

# Test Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123",
    "recaptchaToken": "token_from_recaptcha"
  }'
```

---

## 🌐 Deployment

### Prerequisites for Production

- ✅ Domain name configured
- ✅ SSL certificate (HTTPS required for reCAPTCHA)
- ✅ Production database setup
- ✅ Environment variables configured
- ✅ Google reCAPTCHA keys updated with production domain
- ✅ Payment gateway in live mode

### Deploying Backend

#### Option 1: Traditional Server (VPS)

1. **Install Node.js and PM2:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

2. **Clone and Install:**
```bash
git clone <repository-url>
cd server
npm install --production
```

3. **Configure Environment:**
```bash
nano .env
# Add production environment variables
```

4. **Start with PM2:**
```bash
pm2 start index.js --name surangatours-api
pm2 save
pm2 startup
```

5. **Setup Nginx Reverse Proxy:**
```nginx
server {
    listen 80;
    server_name api.surangatours.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 2: Cloud Platforms

**Heroku:**
```bash
heroku create surangatours-api
heroku config:set NODE_ENV=production
heroku config:set DB_NAME=xxx
# Set all other environment variables
git push heroku main
```

**Railway/Render:**
- Connect GitHub repository
- Configure environment variables in dashboard
- Deploy automatically on push

### Deploying Frontend

#### Build for Production

```bash
cd client
npm run build
```

#### Option 1: Serve with Backend

Copy build folder to server and serve with Express:

```javascript
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
```

#### Option 2: Static Hosting

**Netlify:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Add environment variables

**Vercel:**
1. Import project
2. Configure framework preset: Create React App
3. Add environment variables
4. Deploy

**AWS S3 + CloudFront:**
```bash
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Database Migration

```bash
# Ensure database is created
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS surangatours;"

# Run migrations (if using sequelize-cli)
npx sequelize-cli db:migrate

# Or let Sequelize sync on first run (development only)
# In production, use explicit migrations
```

### Environment-Specific Configuration

Create environment-specific files:

**.env.production (Server):**
```bash
NODE_ENV=production
PORT=5000
DB_NAME=surangatours_prod
DB_USER=prod_user
DB_PASS=super_secure_production_password
DB_HOST=production-db-host.com
JWT_SECRET=extremely_secure_production_jwt_secret_minimum_32_chars
RECAPTCHA_SITE_KEY=production_site_key
RECAPTCHA_SECRET_KEY=production_secret_key
GOOGLE_AI_API_KEY=production_ai_key
EMAIL_HOST=smtp.production-mail.com
CLIENT_URL=https://www.surangatours.com
```

**.env.production (Client):**
```bash
REACT_APP_API_URL=https://api.surangatours.com/api
REACT_APP_RECAPTCHA_SITE_KEY=production_site_key
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Failed

**Error:** `❌ Unable to connect to the database`

**Solutions:**
- Verify MySQL service is running: `sudo systemctl status mysql`
- Check database credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`
- Verify user permissions

#### 2. reCAPTCHA Not Working

**Error:** `"Invalid domain for site key"` or widget not showing

**Solutions:**
- Add your domain to reCAPTCHA admin console
- For localhost, add both `localhost` and `127.0.0.1`
- Verify site key in client `.env` matches admin console
- Check browser console for errors
- Ensure reCAPTCHA script is loaded

#### 3. CORS Errors

**Error:** `Access to fetch at ... has been blocked by CORS policy`

**Solutions:**
- Verify `CLIENT_URL` in server `.env`
- Check CORS configuration in `index.js`
- Ensure frontend is making requests to correct API URL

#### 4. Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
```

#### 5. JWT Token Invalid

**Error:** `JsonWebTokenError: invalid signature`

**Solutions:**
- Verify `JWT_SECRET` is consistent across restarts
- Don't change JWT_SECRET in production (invalidates existing tokens)
- Check token expiration time

#### 6. Email Not Sending

**Error:** Email verification not received

**Solutions:**
- For Gmail, use App Password, not regular password
- Enable "Less secure app access" or use OAuth2
- Check spam folder
- Verify EMAIL_HOST and EMAIL_PORT settings

#### 7. Build Fails

**Error:** `Failed to compile`

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React cache
rm -rf node_modules/.cache
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed
- Add comments for complex logic

---

## 📞 Support

### Getting Help

If you encounter issues:

1. 📖 Check this README and troubleshooting section
2. 📄 Review `RECAPTCHA_IMPLEMENTATION.md` for reCAPTCHA issues
3. 🔍 Search existing issues on GitHub
4. 📧 Contact support team

### Contact Information

- **Email:** support@surangatours.com
- **Documentation:** [Wiki](#)
- **Issue Tracker:** [GitHub Issues](#)

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&style=flat-square) React Team
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&style=flat-square) Node.js Foundation
- ![Express](https://img.shields.io/badge/-Express-000000?logo=express&style=flat-square) Express.js Team
- ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&style=flat-square) MySQL Team
- ![Google](https://img.shields.io/badge/-Google_AI-4285F4?logo=google&style=flat-square) Google AI
- ![reCAPTCHA](https://img.shields.io/badge/-reCAPTCHA-0066CC?logo=google-chrome&style=flat-square) Google reCAPTCHA

---

<div align="center">

**Made with ❤️ by the SurangaTours Team**

![Stars](https://img.shields.io/github/stars/surangatours/surangatours?style=social)
![Forks](https://img.shields.io/github/forks/surangatours/surangatours?style=social)
![Issues](https://img.shields.io/github/issues/surangatours/surangatours)

© 2024 SurangaTours. All rights reserved.

</div>

---

## 📸 Logo Placeholders

> **Note:** You can add your own logos by replacing the placeholder URLs. Here are the locations where logos can be added:

1. **Main Header Logo** - Replace the text header with your company logo
   ```markdown
   ![SurangaTours Logo](./client/public/logo.png)
   ```

2. **Feature Icons** - Add custom icons for each feature section

3. **Tech Stack Logos** - Already using shields.io badges, but you can add larger logos

4. **Architecture Diagram** - Replace ASCII art with actual diagram image

5. **Footer Logo** - Add company logo in footer section

### Suggested Logo Locations in Code:

**Client (`/client/public/index.html`):**
```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
<!-- Add your logo -->
<img src="%PUBLIC_URL%/logo.png" alt="SurangaTours Logo" />
```

**Homepage (`/client/src/pages/HomePage.jsx`):**
```jsx
import logo from '../assets/logo.png';
// Use in component
<img src={logo} alt="SurangaTours" />
```

**Recommended Logo Sizes:**
- Header: 200x50px
- Favicon: 32x32px
- Social Media: 1200x630px
- App Icon: 512x512px

+++ README.md (修改后)
# 🚐 SurangaTours - Travel & Tour Management System

<div align="center">

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-ISC-blue)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?logo=python)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--learn-FF6F00?logo=scikit-learn)

**Your Complete Solution for Modern Tour Management with AI-Powered Recommendations**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Prerequisites](#-prerequisites) • [Installation](#-installation) • [Running the Application](#-running-the-application) • [Configuration](#-configuration) • [API Reference](#-api-reference)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup Guide](#-installation--setup-guide)
  - [Part 1: Client (React Frontend)](#part-1-client-react-frontend)
  - [Part 2: Server (Express Backend)](#part-2-server-express-backend)
  - [Part 3: Python ML Service](#part-3-python-ml-service)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)
- [Support](#-support)

---

## 🌟 Overview

**SurangaTours** is a comprehensive full-stack web application designed to revolutionize tour and travel management. Built with modern technologies, it provides a seamless experience for tourists, drivers, administrators, and payment processing. The platform also includes an AI-powered recommendation engine built with Python and Machine Learning.

The platform enables:
- 🧑‍💼 **Tourists** to browse destinations, book trips, and manage payments
- 🚗 **Drivers** to view assignments and manage schedules
- 👨‍💼 **Administrators** to oversee operations, manage users, and monitor bookings
- 💳 **Payment Center** for secure transaction processing
- 🤖 **AI Integration** for intelligent destination recommendations using Machine Learning

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ Secure user registration and login with JWT authentication
- ✅ Google reCAPTCHA v2 integration for bot protection
- ✅ Role-based access control (Admin, Driver, Tourist)
- ✅ Password reset functionality with email verification
- ✅ Protected routes and middleware security

### 🎯 User Management
- 👤 User profile management
- 🎭 Multi-role support (Admin, Driver, Tourist)
- 📧 Email verification system
- 🔑 Secure password hashing with bcryptjs

### 🏞️ Destination & Trip Management
- 🗺️ Browse and search destinations
- 📅 Create and manage trip schedules
- 🏷️ Categorize trips by destination
- ⭐ Review and rating system

### 🚌 Fleet Management
- 🚐 Vehicle inventory management
- 🔧 Vehicle maintenance tracking
- 📊 Capacity and availability monitoring

### 📦 Booking System
- 🎫 Real-time booking creation and management
- 📋 Booking status tracking
- 🔔 Notification system
- 📝 Booking history and records

### 💰 Payment Processing
- 💳 Secure payment gateway integration (PayHere)
- 🧾 Invoice generation
- 💵 Multiple payment methods support
- 📊 Payment status tracking

### 🤖 AI & Machine Learning Integration
- 🧠 Google Generative AI integration for chat assistance
- 🎯 ML-powered destination recommendations based on user preferences
- 📊 Clustering algorithm for smart destination matching
- 💬 Intelligent chatbot assistance

### 📊 Admin Dashboard
- 📈 Analytics and reporting
- 👥 User management
- 🚗 Driver assignment
- 📋 Booking oversight
- 🏞️ Destination management

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  CLIENT (React - Port 3000)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Public  │  │   User   │  │  Driver  │  │  Admin   │   │
│  │  Pages   │  │Dashboard │  │Dashboard │  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               SERVER (Express.js - Port 5000)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controllers│  │Middleware│  │ Services │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              External Integrations                    │  │
│  │  Google AI │ reCAPTCHA │ Nodemailer │ PayHere │ ML   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           │                                    │
           │ Sequelize ORM                      │ HTTP API
           ▼                                    ▼
┌─────────────────────────────────┐  ┌──────────────────────┐
│     DATABASE (MySQL)            │  │  PYTHON ML SERVICE   │
│  Users │ Drivers │ Bookings     │  │    (Flask - 8000)    │
│  Trips │ Vehicles │ Payments    │  │  ┌────────────────┐  │
└─────────────────────────────────┘  │  │ Recommendation │  │
                                     │  │     Engine     │  │
                                     │  └────────────────┘  │
                                     └──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI Library |
| React Router | 7.13.1 | Routing |
| Tailwind CSS | 4.2.1 | Styling |
| Axios | 1.13.6 | HTTP Client |
| Leaflet | 1.9.4 | Interactive Maps |

### Backend (Server)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | Runtime Environment |
| Express.js | 5.2.1 | Web Framework |
| Sequelize | 6.37.7 | ORM (Object-Relational Mapping) |
| MySQL | 3.18.2 | Database Driver |
| JWT | 9.0.3 | Authentication Tokens |
| bcryptjs | 3.0.3 | Password Hashing |
| Nodemailer | 8.0.5 | Email Service |
| Multer | 1.4.5 | File Upload Handling |

### Machine Learning Service (Python)
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.x | Programming Language |
| Flask | Latest | Web Framework |
| Flask-CORS | Latest | Cross-Origin Resource Sharing |
| Scikit-learn | Latest | Machine Learning Library |
| Pandas | Latest | Data Manipulation |
| Joblib | Latest | Model Serialization |

### External Services
- 🤖 **Google Generative AI** - AI-powered chat features
- 🔒 **Google reCAPTCHA v2** - Bot protection
- 📧 **Nodemailer** - Email services (Gmail SMTP)
- 💳 **PayHere** - Payment gateway (Sri Lanka)
- 🗺️ **Google Maps** - Location services
- 🧠 **Custom ML Model** - Destination recommendation engine

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Essential Software

| Software | Minimum Version | Download Link | How to Check |
|----------|----------------|---------------|--------------|
| **Node.js** | 18.x or higher | [Download](https://nodejs.org/) | `node --version` |
| **npm** | 9.x or higher | Included with Node.js | `npm --version` |
| **Python** | 3.8 or higher | [Download](https://www.python.org/) | `python --version` |
| **MySQL** | 8.0 or higher | [Download](https://dev.mysql.com/downloads/) | `mysql --version` |
| **Git** | Latest | [Download](https://git-scm.com/) | `git --version` |

### For Beginners: Step-by-Step Installation

#### Windows Users:

1. **Install Node.js:**
   - Go to https://nodejs.org/
   - Download the "LTS" (Long Term Support) version
   - Run the installer and click "Next" through all steps
   - Restart your computer after installation

2. **Install Python:**
   - Go to https://www.python.org/downloads/
   - Download Python 3.11 or later
   - **IMPORTANT:** Check the box "Add Python to PATH" during installation
   - Click "Install Now"

3. **Install MySQL:**
   - Go to https://dev.mysql.com/downloads/mysql/
   - Download "MySQL Installer for Windows"
   - Run the installer and choose "Developer Default"
   - Remember your root password!

4. **Install Git:**
   - Go to https://git-scm.com/download/win
   - Download and run the installer
   - Use default settings

#### macOS Users:

1. **Install Homebrew (Package Manager):**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js:**
   ```bash
   brew install node
   ```

3. **Install Python:**
   ```bash
   brew install python
   ```

4. **Install MySQL:**
   ```bash
   brew install mysql
   ```

5. **Install Git:**
   ```bash
   brew install git
   ```

#### Linux (Ubuntu/Debian) Users:

1. **Update Package List:**
   ```bash
   sudo apt update
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install Python:**
   ```bash
   sudo apt install python3 python3-pip python3-venv
   ```

4. **Install MySQL:**
   ```bash
   sudo apt install mysql-server
   ```

5. **Install Git:**
   ```bash
   sudo apt install git
   ```

### Required Accounts & API Keys

You'll need to sign up for these services and get API keys:

1. **Google reCAPTCHA Keys:**
   - Visit: https://www.google.com/recaptcha/admin
   - Choose "reCAPTCHA v2" → "Checkbox"
   - Enter your domain (use localhost for development)
   - Copy the Site Key and Secret Key

2. **Google AI API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Create a new API key

3. **Email Service (Gmail):**
   - If using Gmail, enable 2-Factor Authentication
   - Generate an App Password at: https://myaccount.google.com/apppasswords
   - Use this app password (not your regular password)

4. **PayHere Merchant Account (for Sri Lankan payments):**
   - Visit: https://payhere.lk/
   - Create a merchant account
   - Get Merchant ID and Secret Key

---

## 🚀 Installation & Setup Guide

This guide will walk you through setting up all three components of the application. Follow each part carefully.

### Part 1: Client (React Frontend)

The client is the user interface that runs in your web browser.

#### Step 1.1: Navigate to Client Directory

Open your terminal/command prompt and navigate to the client folder:

```bash
cd /workspace/client
```

Or if you're in the root project directory:

```bash
cd client
```

#### Step 1.2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

**What this does:** This command reads the `package.json` file and downloads all the libraries needed for the React application (React, React Router, Axios, Tailwind CSS, etc.).

**Expected Output:** You'll see a progress bar and a list of installed packages. This may take 2-5 minutes depending on your internet speed.

**Troubleshooting:**
- If you get permission errors on Mac/Linux, try: `sudo npm install`
- If you get network errors, check your internet connection
- If you see vulnerabilities warnings, they're usually safe to ignore for development

#### Step 1.3: Create Environment File

Create a `.env` file in the `client` directory:

```bash
# On Windows (Command Prompt):
echo REACT_APP_API_URL=http://localhost:5000/api > .env
echo REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key >> .env

# On Mac/Linux:
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key" >> .env
```

Or manually create a file named `.env` in the `client` folder with this content:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

**Important:** Replace `your_recaptcha_site_key_here` with your actual Google reCAPTCHA site key.

#### Step 1.4: Start the Client

To run the client in development mode:

```bash
npm start
```

**What this does:** This starts the React development server with hot-reload (automatic refresh when you make changes).

**Expected Output:**
```
Compiled successfully!

You can now view SurangaTours in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Note:** The first time you run this, it may take 1-2 minutes to compile.

**To Stop the Client:** Press `Ctrl + C` in the terminal.

#### Step 1.5: Build for Production (Optional)

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

---

### Part 2: Server (Express Backend)

The server handles all business logic, database operations, and API requests.

#### Step 2.1: Navigate to Server Directory

Open a **NEW terminal window** (keep the client running in the first one) and navigate to the server folder:

```bash
cd /workspace/server
```

Or:

```bash
cd server
```

#### Step 2.2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

**What this does:** Downloads all backend dependencies (Express, Sequelize, JWT, bcryptjs, Nodemailer, etc.).

**Expected Output:** List of installed packages. This may take 2-5 minutes.

#### Step 2.3: Set Up MySQL Database

**Option A: Using MySQL Command Line**

1. Open MySQL command line or Terminal:

```bash
mysql -u root -p
```

2. Enter your MySQL root password when prompted.

3. Create the database:

```sql
CREATE DATABASE surangatours;
```

4. Exit MySQL:

```sql
exit;
```

**Option B: Using MySQL Workbench (GUI)**

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click "File" → "New Query Tab"
4. Type: `CREATE DATABASE surangatours;`
5. Click the lightning bolt icon to execute

**Option C: Create User with Permissions (Recommended for Production)**

```sql
CREATE DATABASE surangatours;
CREATE USER 'surangatours_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON surangatours.* TO 'surangatours_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

#### Step 2.4: Set Up SSL Certificates (If Using Cloud Database)

If you're using a cloud MySQL database (like Aiven), you need SSL certificates:

```bash
# Check if certs directory exists
ls -la certs/

# If using Aiven, download the CA certificate and place it in the certs folder
# The certificate should be named 'ca.pem'
```

For local development, you can skip SSL configuration.

#### Step 2.5: Create Environment File

Create a `.env` file in the `server` directory. You can copy from the example:

```bash
# Copy the example file
cp .env.example .env
```

Or manually create a `.env` file with this content:

```env
# Server Port
PORT=5000

# JWT Secret (Change this to a random string in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Database Configuration - LOCAL DEVELOPMENT
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=surangatours
DB_PORT=3306

# SSL Configuration (Set to false for local development)
DB_SSL=false

# Google reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Google AI API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Groq API Key (if using)
GROQ_API_KEY=your_groq_api_key_here

# Email Configuration (Gmail Example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Payment Gateway Configuration (PayHere)
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_SECRET=your_payhere_secret

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important:** Replace all placeholder values (anything with `your_` or `_here`) with your actual credentials.

#### Step 2.6: Start the Server

To run the server in development mode with auto-reload:

```bash
npm run dev
```

**What this does:** Starts the Express server with nodemon, which automatically restarts when you make code changes.

**Expected Output:**
```
✅ MySQL Database connected successfully.
🚀 Server running on port 5000
```

**Alternative:** To run without auto-reload:
```bash
npm start
```

**To Stop the Server:** Press `Ctrl + C` in the terminal.

---

### Part 3: Python ML Service

The Python ML service provides AI-powered destination recommendations using machine learning.

#### Step 3.1: Verify Python Installation

First, check if Python is installed:

```bash
python --version
```

or on some systems:

```bash
python3 --version
```

**Expected Output:** `Python 3.8.x` or higher

**If Python is not installed:** Refer to the Prerequisites section above.

#### Step 3.2: Navigate to Python-ML Directory

Open a **THIRD terminal window** (keep client and server running) and navigate:

```bash
cd /workspace/python-ml
```

Or:

```bash
cd python-ml
```

#### Step 3.3: Create Virtual Environment

A virtual environment keeps your Python dependencies isolated from your system Python.

**On Windows:**

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate
```

**On Mac/Linux:**

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

**Expected Output:** You'll see `(venv)` appear at the beginning of your terminal prompt, like:
```
(venv) user@computer:~/python-ml$
```

**What this does:** Creates an isolated Python environment in the `venv` folder where packages will be installed.

**Troubleshooting:**
- If `python` command doesn't work, try `python3`
- If you get "module not found" error, you may need to install venv: `sudo apt install python3-venv` (Linux)

#### Step 3.4: Upgrade pip (Recommended)

Always upgrade pip to the latest version:

```bash
pip install --upgrade pip
```

or:

```bash
python -m pip install --upgrade pip
```

#### Step 3.5: Install Required Libraries

Install all dependencies from requirements.txt:

```bash
pip install -r requirements.txt
```

**What this does:** Installs Flask, Flask-CORS, Pandas, Joblib, and Scikit-learn.

**Expected Output:**
```
Collecting flask
  Downloading flask-x.x.x-py3-none-any.whl...
Collecting flask-cors
  Downloading flask_cors-x.x.x-py2.py3-none-any.whl...
Collecting pandas
  Downloading pandas-x.x.x-cp311-cp311-manylinux_2_17_x86_64.whl...
Collecting joblib
  Downloading joblib-x.x.x-py3-none-any.whl...
Collecting scikit-learn
  Downloading scikit_learn-x.x.x-cp311-cp311-manylinux_2_17_x86_64.whl...
Successfully installed flask-x.x.x flask-cors-x.x.x ...
```

**Note:** This may take 3-10 minutes as scikit-learn and pandas are large packages.

**Troubleshooting:**
- If you get permission errors, make sure your virtual environment is activated
- If installation fails, try: `pip install --user -r requirements.txt`

#### Step 3.6: Verify Installation (Optional)

Check that all packages are installed:

```bash
pip list
```

You should see: flask, flask-cors, pandas, joblib, scikit-learn, and their dependencies.

#### Step 3.7: Understand the ML Model Files

The ML service uses pre-trained model files:

```
python-ml/
├── model/
│   ├── mlp.pkl          # Trained Multi-Layer Perceptron model
│   └── scaler.pkl       # Feature scaler for data normalization
├── model-data/
│   └── cluster_with_distance copy.csv  # Cluster data for recommendations
├── data/
│   ├── data_with_clusterName.csv       # Training data
│   └── cluster_latitude_longitude.csv  # Geographic cluster data
├── requirements.txt      # Python dependencies
└── run_model.py         # Flask application
```

**Note:** These model files are already included in the repository. You don't need to train the model yourself unless you want to modify it.

#### Step 3.8: Start the ML Service

Run the Flask ML service:

```bash
python run_model.py
```

or on some systems:

```bash
python3 run_model.py
```

**What this does:** Starts the Flask server on port 8000 that provides ML prediction endpoints.

**Expected Output:**
```
[OK] ML Model loaded successfully - TripIQ Python ML Service
[INFO] TripIQ Python ML Service starting on port 8000...
 * Serving Flask app 'run_model'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8000
 * Running on http://xxx.xxx.xxx.xxx:8000
Press CTRL+C to quit
```

**To Test the ML Service:** Open a browser and go to `http://localhost:8000/health`. You should see:
```json
{
  "status": "ok",
  "service": "TripIQ ML Service"
}
```

**To Stop the ML Service:** Press `Ctrl + C` in the terminal.

#### Step 3.9: Deactivating Virtual Environment

When you're done working with the ML service:

```bash
deactivate
```

This exits the virtual environment and returns to your system Python.

**Note:** You'll need to reactivate the virtual environment (`source venv/bin/activate` or `venv\Scripts\activate`) every time you want to run the ML service.

---

## ⚙️ Configuration

### Environment Variables Summary

#### Client (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `REACT_APP_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key | `6LcXXXXXXXXX` |

#### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `surangatours` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_SSL` | Enable SSL for DB | `false` (local) or `true` (cloud) |
| `RECAPTCHA_SITE_KEY` | reCAPTCHA site key | `6LcXXXXXXXXX` |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret key | `6LcXXXXXXXXX` |
| `GOOGLE_AI_API_KEY` | Google AI API key | `AIzaSyXXXXXX` |
| `EMAIL_USER` | Email address | `your@gmail.com` |
| `EMAIL_PASSWORD` | Email app password | `xxxx xxxx xxxx xxxx` |
| `PAYHERE_MERCHANT_ID` | PayHere merchant ID | `1234567` |
| `PAYHERE_SECRET` | PayHere secret | `your_secret` |

---

## ▶️ Running the Application

### Quick Start Guide

You need to run **all three components** simultaneously in separate terminal windows.

#### Terminal 1: Start the Client (React Frontend)

```bash
cd /workspace/client
npm start
```

**Access:** http://localhost:3000

#### Terminal 2: Start the Server (Express Backend)

```bash
cd /workspace/server
npm run dev
```

**API Base URL:** http://localhost:5000/api

#### Terminal 3: Start the ML Service (Python Flask)

```bash
cd /workspace/python-ml

# Activate virtual environment first (if not already active)
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Run the ML service
python run_model.py
```

**ML Service URL:** http://localhost:8000

### Verification Checklist

After starting all services, verify everything is working:

1. ✅ **Client:** Open http://localhost:3000 in your browser - you should see the SurangaTours homepage
2. ✅ **Server:** Check terminal for "✅ MySQL Database connected successfully." message
3. ✅ **ML Service:** Visit http://localhost:8000/health - you should see `{"status": "ok"}`

### Development Workflow

1. Make changes to your code
2. **Client:** Auto-refreshes in the browser
3. **Server:** Auto-restarts with nodemon (when using `npm run dev`)
4. **ML Service:** Requires manual restart (Ctrl+C and run again) if you modify `run_model.py`

### Stopping All Services

Press `Ctrl + C` in each terminal window to stop the services.

---

## 📁 Project Structure

```
SurangaTours/
├── client/                     # React Frontend (Port 3000)
│   ├── public/
│   │   ├── index.html         # HTML template with reCAPTCHA & PayHere scripts
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── logo192.png
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── common/
│   │   │       └── ProtectedRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── auth/          # Login, Register, ForgotPassword
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── user/          # User dashboard pages
│   │   │   ├── driver/        # Driver dashboard pages
│   │   │   ├── payment/       # Payment pages
│   │   │   └── destinations/  # Destination listing & details
│   │   ├── App.js             # Main app component with routing
│   │   ├── App.css            # Global styles
│   │   └── index.js           # Entry point
│   ├── package.json           # Frontend dependencies
│   └── .env                   # Frontend environment variables
│
├── server/                     # Express Backend (Port 5000)
│   ├── certs/                 # SSL certificates for database
│   │   └── ca.pem
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── userController.js
│   │   ├── driverController.js
│   │   ├── bookingController.js
│   │   ├── tripController.js
│   │   ├── destinationController.js
│   │   ├── vehicleController.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   └── aiController.js
│   ├── middleware/            # Custom middleware
│   │   └── auth.js            # JWT authentication
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Driver.js
│   │   ├── Booking.js
│   │   ├── Trip.js
│   │   ├── Destination.js
│   │   ├── Vehicle.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   ├── VerificationCode.js
│   │   ├── UserFavorite.js
│   │   └── index.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── userRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── aiRoutes.js
│   ├── services/              # External service integrations
│   ├── seed/                  # Database seeding scripts
│   ├── index.js               # Server entry point
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Example environment file
│   └── .env                   # Backend environment variables
│
├── python-ml/                  # Python ML Service (Port 8000)
│   ├── data/                  # Raw training data
│   │   ├── data_with_clusterName.csv
│   │   └── cluster_latitude_longitude.csv
│   ├── model/                 # Pre-trained ML models
│   │   ├── mlp.pkl           # Multi-Layer Perceptron model
│   │   └── scaler.pkl        # Feature scaler
│   ├── model-data/           # Processed model data
│   │   └── cluster_with_distance copy.csv
│   ├── requirements.txt      # Python dependencies
│   ├── run_model.py          # Flask application
│   └── venv/                 # Python virtual environment (created during setup)
│
├── README.md                   # This file
├── RECAPTCHA_IMPLEMENTATION.md # Detailed reCAPTCHA guide
└── .gitignore
```

---

## 📡 API Reference

### Base URLs

- **Backend API:** `http://localhost:5000/api`
- **ML Service:** `http://localhost:8000`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | ✅ |
| PUT | `/users/profile` | Update user profile | ✅ |
| GET | `/users/bookings` | Get user bookings | ✅ |
| PUT | `/users/password` | Change password | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/users` | Get all users | ✅ Admin |
| PUT | `/admin/users/:id` | Update user | ✅ Admin |
| DELETE | `/admin/users/:id` | Delete user | ✅ Admin |
| GET | `/admin/bookings` | Get all bookings | ✅ Admin |
| GET | `/admin/drivers` | Manage drivers | ✅ Admin |
| GET | `/admin/destinations` | Manage destinations | ✅ Admin |

### ML Service Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/health` | Health check | None |
| POST | `/predict` | Get destination recommendations | `Likes_Beach`, `Likes_Mountain`, `Likes_Culture`, `Likes_Adventure`, `Budget`, `Total_Days` |

**Example ML Prediction Request:**

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Likes_Beach": 1,
    "Likes_Mountain": 0,
    "Likes_Culture": 1,
    "Likes_Adventure": 1,
    "Budget": 3,
    "Total_Days": 5
  }'
```

**Response:**
```json
{
  "clusters": [
    {"cluster": "Cultural Heritage Sites", "score": 0.95},
    {"cluster": "Adventure Beach Resorts", "score": 0.87},
    ...
  ]
}
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Client Issues

**Problem:** `npm start` fails with "Something is already running on port 3000"
**Solution:**
```bash
# Kill the process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**Problem:** "Module not found" errors
**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Server Issues

**Problem:** "Cannot connect to database"
**Solution:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check database exists: `SHOW DATABASES;`
3. Verify credentials in `.env` file
4. For SSL issues, set `DB_SSL=false` for local development

**Problem:** "Port 5000 already in use"
**Solution:**
```bash
# Change PORT in .env file to another port (e.g., 5001)
# Or kill the process using port 5000
```

**Problem:** JWT token errors
**Solution:** Ensure `JWT_SECRET` is set in `.env` file

#### Python ML Service Issues

**Problem:** "python: command not found"
**Solution:**
- Windows: Try `python3` instead of `python`
- Install Python from https://python.org
- Ensure Python is added to PATH

**Problem:** "ModuleNotFoundError: No module named 'flask'"
**Solution:**
1. Activate virtual environment:
   ```bash
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
2. Install requirements: `pip install -r requirements.txt`

**Problem:** "Permission denied" when creating venv
**Solution:**
```bash
# Mac/Linux:
python3 -m venv venv
# Or install with user flag:
pip install --user -r requirements.txt
```

**Problem:** ML model files not found
**Solution:** Verify the model files exist:
```bash
ls -la model/
ls -la model-data/
```
If missing, re-clone the repository or restore from backup.

**Problem:** Port 8000 already in use
**Solution:** Change port in `run_model.py`:
```python
app.run(host='0.0.0.0', port=8001, debug=False)  # Changed to 8001
```

#### General Issues

**Problem:** CORS errors in browser console
**Solution:**
1. Ensure server is running
2. Check `CLIENT_URL` in server `.env` matches your client URL
3. Verify Flask-CORS is enabled in `run_model.py`

**Problem:** reCAPTCHA not working
**Solution:**
1. Verify both site key and secret key are correct
2. Ensure domain is registered in reCAPTCHA admin console
3. For localhost, use "localhost" as the domain

---

## 🤝 Support

If you encounter any issues not covered in this guide:

1. Check the existing issue tracker in the repository
2. Review the `RECAPTCHA_IMPLEMENTATION.md` for detailed reCAPTCHA setup
3. Ensure all environment variables are correctly configured
4. Verify all three services are running on their respective ports

### Development Team Contact

For questions or support, please contact the development team.

---

## 📝 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- React Team for the amazing frontend library
- Express.js community
- Python and Flask communities
- Scikit-learn for machine learning tools
- All contributors to this project

---

<div align="center">

**Made with ❤️ by the SurangaTours Team**

**Happy Travels! 🚐✈️🏝️**

</div>