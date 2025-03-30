
# Backend Server Setup

This folder contains a Node.js Express server that connects to your SQL database.

## Database Schema

The database has the following tables:
1. `users` - Stores user information and authentication details
2. `products` - Stores menu items for the restaurant
3. `orders` - Stores order information
4. `order_items` - Stores items within an order

## Setup Instructions

1. Install the required dependencies:
   ```
   npm install express mysql2 cors body-parser dotenv
   ```

2. Set up the database tables:
   - Connect to your database: `mysql -h sql12.freesqldatabase.com -u sql12770310 -p`
   - Enter password: `98Z5LAMlXb`
   - Create the tables using the SQL commands in `init-db.sql`

3. Start the server:
   ```
   node src/server/index.js
   ```

4. The server will run at `http://localhost:5000`

## API Endpoints

### Users
- GET `/api/users` - Get all users
- POST `/api/users` - Create new user
- POST `/api/login` - User login
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create new product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

### Orders
- GET `/api/orders` - Get all orders
- GET `/api/orders/customer/:customerId` - Get orders by customer ID
- POST `/api/orders` - Create new order
- PUT `/api/orders/:id/status` - Update order status
