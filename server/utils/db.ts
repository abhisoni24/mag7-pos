import { storage } from '../storage';
import { MongoUser, InsertUser, UserRole } from '@shared/schema';
import bcrypt from 'bcryptjs';

/**
 * Initializes the database with some sample data if empty
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if any users exist
    const users = await storage.getUsers();
    
    if (users.length === 0) {
      console.log('Initializing database with sample data...');
      
      // Create default admin user
      await createDefaultAdmin();
      
      // Create sample users for each role
      await createSampleUsers();
      
      // Create sample tables
      await createSampleTables();
      
      // Create sample menu items
      await createSampleMenuItems();
      
      console.log('Database initialization complete.');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

const createDefaultAdmin = async (): Promise<MongoUser> => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser: InsertUser = {
    name: 'System Administrator',
    email: 'admin@restaurant.com',
    password: hashedPassword,
    role: UserRole.ADMIN,
    active: true
  };
  
  return storage.createUser(adminUser);
};

const createSampleUsers = async (): Promise<void> => {
  const roles = [UserRole.HOST, UserRole.WAITER, UserRole.CHEF, UserRole.MANAGER, UserRole.OWNER];
  const names = [
    'John Smith',
    'Emma Johnson',
    'Robert Wilson',
    'Maria Garcia',
    'David Chen'
  ];
  
  for (let i = 0; i < roles.length; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user: InsertUser = {
      name: names[i],
      email: `${roles[i]}@restaurant.com`,
      password: hashedPassword,
      role: roles[i],
      active: true
    };
    
    await storage.createUser(user);
  }
  
  // Add an extra waiter
  const hashedPassword = await bcrypt.hash('password123', 10);
  await storage.createUser({
    name: 'Lisa Brown',
    email: 'lisa@restaurant.com',
    password: hashedPassword,
    role: UserRole.WAITER,
    active: true
  });
};

const createSampleTables = async (): Promise<void> => {
  for (let i = 1; i <= 20; i++) {
    await storage.createTable({
      number: i,
      capacity: i % 3 === 0 ? 6 : (i % 2 === 0 ? 4 : 2),
      floor: Math.ceil(i / 10),
      status: 'available'
    });
  }
};

const createSampleMenuItems = async (): Promise<void> => {
  const menuItems = [
    // Appetizers
    {
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter',
      price: 4.95,
      category: 'appetizer',
      available: true,
      isSpecial: false
    },
    {
      name: 'Mozzarella Sticks',
      description: 'Breaded mozzarella with marinara sauce',
      price: 6.95,
      category: 'appetizer',
      available: true,
      isSpecial: false
    },
    {
      name: 'Chicken Wings',
      description: 'Spicy buffalo wings with blue cheese dip',
      price: 8.95,
      category: 'appetizer',
      available: true,
      isSpecial: false
    },
    {
      name: 'Calamari',
      description: 'Fried squid with lemon aioli',
      price: 9.95,
      category: 'appetizer',
      available: true,
      isSpecial: false
    },
    
    // Main Courses
    {
      name: 'Grilled Salmon',
      description: 'Fresh salmon with lemon butter sauce',
      price: 18.95,
      category: 'main_course',
      available: true,
      isSpecial: false
    },
    {
      name: 'Beef Burger',
      description: 'Angus beef patty with lettuce, tomato, and cheese',
      price: 12.95,
      category: 'main_course',
      available: true,
      isSpecial: false
    },
    {
      name: 'Chicken Alfredo',
      description: 'Fettuccine pasta with creamy alfredo sauce and grilled chicken',
      price: 14.95,
      category: 'main_course',
      available: true,
      isSpecial: true
    },
    {
      name: 'Vegetable Stir Fry',
      description: 'Mixed vegetables with tofu in a savory sauce',
      price: 13.95,
      category: 'main_course',
      available: true,
      isSpecial: false
    },
    
    // Sides
    {
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 3.95,
      category: 'side',
      available: true,
      isSpecial: false
    },
    {
      name: 'Onion Rings',
      description: 'Battered and fried onion rings',
      price: 4.95,
      category: 'side',
      available: true,
      isSpecial: false
    },
    {
      name: 'Side Salad',
      description: 'Mixed greens with house dressing',
      price: 4.95,
      category: 'side',
      available: true,
      isSpecial: false
    },
    
    // Desserts
    {
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with vanilla ice cream',
      price: 6.95,
      category: 'dessert',
      available: true,
      isSpecial: false
    },
    {
      name: 'Cheesecake',
      description: 'New York style cheesecake with berry compote',
      price: 7.95,
      category: 'dessert',
      available: true,
      isSpecial: true
    },
    {
      name: 'Apple Pie',
      description: 'Warm apple pie with caramel sauce',
      price: 6.95,
      category: 'dessert',
      available: true,
      isSpecial: false
    },
    
    // Drinks
    {
      name: 'Soda',
      description: 'Assorted soft drinks',
      price: 2.50,
      category: 'drink',
      available: true,
      isSpecial: false
    },
    {
      name: 'Iced Tea',
      description: 'Sweetened or unsweetened',
      price: 2.50,
      category: 'drink',
      available: true,
      isSpecial: false
    },
    {
      name: 'Coffee',
      description: 'Regular or decaf',
      price: 2.95,
      category: 'drink',
      available: true,
      isSpecial: false
    },
    {
      name: 'Chocolate Milkshake',
      description: 'Rich chocolate milkshake with whipped cream',
      price: 4.95,
      category: 'drink',
      available: true,
      isSpecial: false
    }
  ];
  
  for (const item of menuItems) {
    await storage.createMenuItem(item);
  }
};
