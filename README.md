# Setting Up Mag7 POS Locally

This guide will help you set up the Mag7 POS system on your local machine without Replit-specific dependencies.

## Prerequisites

1. Node.js (v18.x or later)
2. MongoDB (local or Atlas cloud instance)
3. Git

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/abhisoni24/mag7-pos.git
cd mag7-pos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=your-secret-key
```

Replace the MongoDB URI with your own connection string. You can select any port you like, and similarly set whatever text you want for the JWT_SECRET.

### 4. Run the Application

```bash
# Start in development mode
npm run dev
```

The server will start on the configured port (default: 5000).

## Login Credentials

| Role    | Email                  | Password   |
| ------- | ---------------------- | ---------- |
| Admin   | admin@restaurant.com   | admin123   |
| Owner   | owner@restaurant.com   | owner123   |
| Manager | manager@restaurant.com | manager123 |
| Chef    | chef@restaurant.com    | chef123    |
| Waiter  | waiter@restaurant.com  | waiter123  |
| Host    | host@restaurant.com    | host123    |

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
