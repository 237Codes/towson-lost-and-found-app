# Towson Lost and Found Application

## 📝 Table of Contents
- [Prerequisites](#prerequisites)
- [Running the Server](#️running-the-server-locally)
- [Running the Client](#running-the-client-application)
- [Common Issues](#common-issues)
- [Need Help](#need-help)


## 🖥️ Running the Server Locally

### Server Structure
```
server/
├── controllers/        # Request handlers and business logic
├── db_actions/        # Database operations
├── emailverify/       # Email verification service
├── routes/           # API route definitions
├── node_modules/     # Dependencies
├── .env              # Environment variables
├── db.js            # Database configuration
├── dbschema.sql     # Database schema implimented so far with new db created by @237Codes
├── index.js         # Server entry point
├── package.json     # Project configuration
└── schema.sql       # Db schema made by @EndritNezir
```

Key files:
- `controllers/`: Handles business logic for authentication, users, and items
- `routes/`: Defines API endpoints and their handlers
- `emailverify/`: Contains email verification service configuration
- `db.js`: Sets up database connection and pool
- `dbschema.sql`: Contains database initialization queries (This is what is implimented and working so far)
- `schema.sql`: Defines table structures and relationships

### Prerequisites
- Node.js v14 or higher
- MySQL v8.0 or higher
- npm (Node Package Manager)

### Initial Setup

1. **Switch to the correct branch and navigate to server**
   ```bash
   git checkout feature/issue-9-login
   cd server
   git pull
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the server directory (Credentials available upon request from Manny):
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=towson_lost_found
   DB_PORT=3306

   # Email Service (for verification emails)
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_APP_PASSWORD=your_app_specific_password
   ```

### Starting the Server

1. **Development Mode** (with auto-reload)
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:3001`

### Verifying Setup

1. **Check Server Status**
   - The terminal should display if the server if set up successfully.
   - The terminal should display if the database is connected successfully.

2. **Test Database Connection**
   ```bash
   curl http://localhost:3001/api/db/test
   ```

### Common Issues

1. **Database Connection Failed**
   - Check .env credentials
   - Ensure you are using the correct routes

2. **Port Already in Use**
   - Kill the process using port 3001:
     ```bash
     lsof -i :3001
     kill -9 <PID>
     ```

3. **Email Verification Not Working**
   - Verify Gmail credentials
   - Check if less secure app access is enabled
   - Verify app password is correct

### Need Help?

Create an issue with label `server-setup` including:
- Error messages
- Node.js version (`node -v`)
- npm version (`npm -v`)
- MySQL version (`mysql --version`)



## 🎨 Running the Client Application

### Client Structure
```
LostAndFound/
├── src/
│   ├── components/
│   │   ├── pages/         # Page-specific components
│   │   │   ├── Buildings.tsx
│   │   │   ├── Home.tsx
│   │   │   └── ItemForm.tsx
│   │   └── ui/           # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   │   └── Layout.astro
│   ├── lib/             # Utility functions
│   ├── pages/           # Astro page routes =====> Add New Pages here 
│   │   ├── buildings/
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── report-found.astro
│   │   ├── report-lost.astro
│   │   ├── signup.astro
│   │   └── verification.astro
│   └── styles/          # Global styles
├── public/             # Static assets
│   └── images/         # Image assets
├── .astro/            # Astro build files
├── astro.config.mjs   # Astro configuration
├── tailwind.config.mjs # Tailwind configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```

Key files:
- `src/components/pages/`: Contains main page components
- `src/components/ui/`: Contains reusable UI components
- `src/pages/`: Defines application routes
- `src/layouts/`: Contains page layouts
- `astro.config.mjs`: Astro build configuration
- `tailwind.config.mjs`: Tailwind CSS configuration

### Prerequisites
- Node.js v14 or higher
- npm (Node Package Manager)
- Server running locally on port 3001

### Initial Setup

1. **Navigate to the client directory**
   ```bash
   cd LostAndFound
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The client application will be available at `http://localhost:4321`

### Verifying Setup

1. **Check Application Status**
   - Open your browser and navigate to `http://localhost:4321`
   - You should see the Towson Lost and Found homepage
   - The navigation should work properly
   - Login/Signup forms should be accessible

2. **Common Routes**
   - Homepage: `http://localhost:4321/`
   - Login: `http://localhost:4321/login`
   - Signup: `http://localhost:4321/signup`
   - Buildings: `http://localhost:4321/buildings`

### Common Issues

1. **Build Errors**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

2. **Page Not Found Errors**
   - Ensure server is running on port 3001
   - Check for any console errors
   - Verify API endpoints in the code match server routes

3. **Styling Issues**
   - Run Tailwind build:
   ```bash
   npm run build:css
   ```

### Development Commands
```bash
# Start development server
npm run dev
```

### Need Help?

Create an issue with label `client-setup` including:
- Error messages
- Browser console output
- Steps to reproduce
- Screenshot of the issue