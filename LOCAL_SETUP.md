# Setting Up Mag7 POS Locally

This guide will help you set up the Mag7 POS system on your local machine without Replit-specific dependencies.

## Prerequisites

1. Node.js (v18.x or later)
2. MongoDB (local or Atlas cloud instance)
3. Git

## Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mag7-pos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mag7_pos
JWT_SECRET=your-secret-key
```

Replace the MongoDB URI with your own connection string.

### 4. Remove Replit-specific Dependencies

If you're setting up locally, you'll need to modify the Vite configuration to remove Replit-specific plugins:

1. Edit `vite.config.ts`:
   - Remove the import for `@replit/vite-plugin-runtime-error-modal`
   - Remove the import for `@replit/vite-plugin-cartographer`
   - Remove these plugins from the plugins array
   - Remove the conditional logic related to `process.env.REPL_ID`

2. Edit `package.json`:
   - Remove the following dependencies:
     ```
     "@replit/vite-plugin-cartographer": "x.x.x",
     "@replit/vite-plugin-runtime-error-modal": "x.x.x",
     ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

### 5. Update Port Configuration

To avoid the EADDRINUSE error when running the development server:

1. The application now uses an environment variable for the port (default: 5000)
2. You can customize this by setting the PORT environment variable

### 6. Run the Application

```bash
# Start in development mode
npm run dev
```

The server will start on the configured port (default: 3000).

## Login Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@example.com      | admin123    |
| Owner   | owner@example.com      | owner123    |
| Manager | manager@example.com    | manager123  |
| Chef    | chef@example.com       | chef123     |
| Waiter  | waiter@example.com     | waiter123   |
| Host    | host@example.com       | host123     |

## Features

- Role-based authentication and access control
- Real-time order management
- Menu management
- Table management
- Payment processing
- Reporting and analytics
- Staff management

## Troubleshooting

- **Port Already in Use Error**: If you encounter an EADDRINUSE error, change the PORT environment variable to a different value.
- **MongoDB Connection Error**: Ensure your MongoDB server is running and the connection URI is correct.