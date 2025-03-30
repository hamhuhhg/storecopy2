const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection configuration
const dbConfig = {
  host: 'sql12.freesqldatabase.com',
  user: 'sql12770310',
  password: '98Z5LAMlXb',
  database: 'sql12770310',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database tables and default data
async function initializeDatabase() {
  try {
    console.log('Checking database tables and initializing if needed...');
    const connection = await pool.getConnection();
    
    // Check if users table exists and has data
    const [userTables] = await connection.query(`
      SELECT * 
      FROM information_schema.tables
      WHERE table_schema = '${dbConfig.database}' 
      AND table_name = 'users'
    `);
    
    if (userTables.length === 0) {
      console.log('Creating users table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'customer', 'restaurant') NOT NULL DEFAULT 'customer',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default users
      console.log('Adding default users...');
      await connection.query(`
        INSERT INTO users (name, email, password, role) VALUES
        ('مدير النظام', 'admin@example.com', 'admin123', 'admin'),
        ('موظف المطعم', 'restaurant@example.com', 'restaurant123', 'restaurant'),
        ('زبون عادي', 'user@example.com', 'user123', 'customer')
      `);
    } else {
      // Check if users table has data
      const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
      if (userCount[0].count === 0) {
        console.log('Users table exists but empty. Adding default users...');
        await connection.query(`
          INSERT INTO users (name, email, password, role) VALUES
          ('مدير النظام', 'admin@example.com', 'admin123', 'admin'),
          ('موظف المطعم', 'restaurant@example.com', 'restaurant123', 'restaurant'),
          ('زبون عادي', 'user@example.com', 'user123', 'customer')
        `);
      }
    }
    
    // Check if products table exists and has data
    const [productTables] = await connection.query(`
      SELECT * 
      FROM information_schema.tables
      WHERE table_schema = '${dbConfig.database}' 
      AND table_name = 'products'
    `);
    
    if (productTables.length === 0) {
      console.log('Creating products table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          image VARCHAR(512),
          category VARCHAR(50) NOT NULL,
          tags TEXT,
          popular BOOLEAN DEFAULT FALSE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default products
      console.log('Adding default products...');
      await addDefaultProducts(connection);
    } else {
      // Check if products table has data
      const [productCount] = await connection.query('SELECT COUNT(*) as count FROM products');
      if (productCount[0].count === 0) {
        console.log('Products table exists but empty. Adding default products...');
        await addDefaultProducts(connection);
      }
    }
    
    // Check if orders table exists
    const [orderTables] = await connection.query(`
      SELECT * 
      FROM information_schema.tables
      WHERE table_schema = '${dbConfig.database}' 
      AND table_name = 'orders'
    `);
    
    if (orderTables.length === 0) {
      console.log('Creating orders table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customerId VARCHAR(255),
          customerName VARCHAR(255) NOT NULL,
          contactNumber VARCHAR(50),
          deliveryAddress TEXT,
          totalAmount DECIMAL(10, 2) NOT NULL,
          status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
          note TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    
    // Check if order_items table exists
    const [orderItemTables] = await connection.query(`
      SELECT * 
      FROM information_schema.tables
      WHERE table_schema = '${dbConfig.database}' 
      AND table_name = 'order_items'
    `);
    
    if (orderItemTables.length === 0) {
      console.log('Creating order_items table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          orderId INT NOT NULL,
          menuItemId VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
        )
      `);
    }
    
    console.log('Database initialization completed successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Function to add default products
async function addDefaultProducts(connection) {
  // Define default products - translated to Arabic
  const defaultProducts = [
    {
      name: 'برجر كلاسيك',
      description: 'قطعة لحم بقري عصيرية مع خس طازج وطماطم وجبنة وصلصتنا الخاصة',
      price: 8.99,
      image: '/images/classic-burger.jpg',
      category: 'food',
      tags: JSON.stringify(['burgers', 'beef', 'popular']),
      popular: true
    },
    {
      name: 'برجر دبل تشيز',
      description: 'قطعتين لحم بقري مع جبنة مضاعفة ومخللات وبصل وصلصتنا المميزة',
      price: 11.99,
      image: '/images/double-cheeseburger.jpg',
      category: 'food',
      tags: JSON.stringify(['burgers', 'beef', 'cheese']),
      popular: false
    },
    {
      name: 'برجر دجاج مقرمش',
      description: 'دجاج مقلي مقرمش مع سلطة كول سلو ومخللات ومايونيز',
      price: 9.99,
      image: '/images/chicken-burger.jpg',
      category: 'food',
      tags: JSON.stringify(['burgers', 'chicken']),
      popular: false
    },
    {
      name: 'عصير برتقال طازج',
      description: 'عصير برتقال طازج مليء بفيتامين سي',
      price: 4.49,
      image: '/images/orange-juice.jpg',
      category: 'juice',
      tags: JSON.stringify(['fruit-juice', 'popular']),
      popular: true
    },
    {
      name: 'سموذي التوت المشكل',
      description: 'مزيج من الفراولة والتوت الأزرق والتوت البري مع الزبادي',
      price: 5.99,
      image: '/images/berry-smoothie.jpg',
      category: 'juice',
      tags: JSON.stringify(['smoothies', 'popular']),
      popular: true
    }
  ];
  
  // Insert default products
  for (const product of defaultProducts) {
    await connection.query(
      'INSERT INTO products (name, description, price, image, category, tags, popular) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product.name, product.description, product.price, product.image, product.category, product.tags, product.popular ? 1 : 0]
    );
  }
}

// Initialize the database when the server starts
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// API endpoints for users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role || 'customer']
    );
    res.status(201).json({ 
      id: result.insertId,
      name,
      email,
      role: role || 'customer' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// API endpoints for products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    
    // Parse tags from JSON string to array
    const products = rows.map(product => ({
      ...product,
      tags: JSON.parse(product.tags || '[]'),
      popular: Boolean(product.popular)
    }));
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Parse tags from JSON string to array
    const product = {
      ...rows[0],
      tags: JSON.parse(rows[0].tags || '[]'),
      popular: Boolean(rows[0].popular)
    };
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image, category, tags, popular } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, image, category, tags, popular) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, image, category, JSON.stringify(tags), popular ? 1 : 0]
    );
    res.status(201).json({ 
      id: result.insertId,
      name,
      description,
      price,
      image,
      category,
      tags,
      popular
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, tags, popular } = req.body;
    
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ?, tags = ?, popular = ? WHERE id = ?',
      [name, description, price, image, category, JSON.stringify(tags), popular ? 1 : 0, id]
    );
    
    res.status(200).json({ id, ...req.body });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// API endpoints for orders
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.name as customerName 
      FROM orders o 
      LEFT JOIN users u ON o.customerId = u.id
    `);
    
    // Get order items for each order
    for (let order of rows) {
      const [items] = await pool.query(
        'SELECT * FROM order_items WHERE orderId = ?',
        [order.id]
      );
      order.items = items;
    }
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

app.get('/api/orders/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE customerId = ?',
      [customerId]
    );
    
    // Get order items for each order
    for (let order of rows) {
      const [items] = await pool.query(
        'SELECT * FROM order_items WHERE orderId = ?',
        [order.id]
      );
      order.items = items;
    }
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Failed to fetch customer orders', error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, totalAmount, customerId, customerName, contactNumber, deliveryAddress, note } = req.body;
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (totalAmount, status, createdAt, customerId, customerName, contactNumber, deliveryAddress, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [totalAmount, 'pending', new Date(), customerId, customerName, contactNumber, deliveryAddress, note || '']
      );
      
      const orderId = orderResult.insertId;
      
      // Insert order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (orderId, menuItemId, name, price, quantity) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.menuItem.id, item.menuItem.name, item.menuItem.price, item.quantity]
        );
      }
      
      // Commit the transaction
      await connection.commit();
      
      res.status(201).json({ 
        id: orderId, 
        status: 'pending',
        createdAt: new Date(),
        ...req.body 
      });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.status(200).json({ id, status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export for potential serverless deployment
module.exports = app;
