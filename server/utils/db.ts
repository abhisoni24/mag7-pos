import { storage } from "../storage";
import { MongoUser, InsertUser, UserRole } from "@shared/schema";
import bcrypt from "bcryptjs";

/**
 * Initializes the database with some sample data if empty
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if any users exist
    const users = await storage.getUsers();

    if (users.length === 0) {
      console.log("Initializing database with sample data...");

      // Create default admin user
      await createDefaultAdmin();

      // Create sample users for each role
      await createSampleUsers();

      // Create sample tables
      await createSampleTables();

      // Create sample menu items
      await createSampleMenuItems();

      console.log("Database initialization complete.");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

const createDefaultAdmin = async (): Promise<MongoUser> => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser: InsertUser = {
    name: "System Administrator",
    email: "admin@restaurant.com",
    password: hashedPassword,
    role: UserRole.ADMIN,
    active: true,
  };

  return storage.createUser(adminUser);
};

const createSampleUsers = async (): Promise<void> => {
  const roles = [
    UserRole.HOST,
    UserRole.WAITER,
    UserRole.CHEF,
    UserRole.MANAGER,
    UserRole.OWNER,
  ];
  const names = [
    "John Smith",
    "Emma Johnson",
    "Robert Wilson",
    "Maria Garcia",
    "David Chen",
  ];

  for (let i = 0; i < roles.length; i++) {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user: InsertUser = {
      name: names[i],
      email: `${roles[i]}@restaurant.com`,
      password: hashedPassword,
      role: roles[i],
      active: true,
    };

    await storage.createUser(user);
  }

  // Add an extra waiter
  const hashedPassword = await bcrypt.hash("password123", 10);
  await storage.createUser({
    name: "Lisa Brown",
    email: "lisa@restaurant.com",
    password: hashedPassword,
    role: UserRole.WAITER,
    active: true,
  });
};

const createSampleTables = async (): Promise<void> => {
  for (let i = 1; i <= 20; i++) {
    await storage.createTable({
      number: i,
      capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
      floor: Math.ceil(i / 10),
      status: "available",
    });
  }
};

const createSampleMenuItems = async (): Promise<void> => {
  const menuItems = [
    // Appetizers
    {
      name: "Power-Up Nachos",
      description: "Loaded with cheese, jalapeños, and XP-boosting guac!",
      price: 9.99,
      category: "appetizer",
      available: true,
      isSpecial: false,
    },
    {
      name: "Health Potion Soup",
      description: "Tomato basil with a mana-restoring swirl of cream",
      price: 6.99,
      category: "appetizer",
      available: true,
      isSpecial: false,
    },
    {
      name: "1-Up Mushroom Bites",
      description:
        "Fried mushroom caps with a side of pixel sauce (Our own Cajun mix)",
      price: 7.99,
      category: "appetizer",
      available: true,
      isSpecial: false,
    },
    {
      name: "Boss Battle Wings",
      description:
        "Spicy buffalo wings that pack a punch (A blend of Tabasco and jalapeño)!",
      price: 11.99,
      category: "appetizer",
      available: true,
      isSpecial: true,
    },

    // Burgers & Sandwiches
    {
      name: "Final Boss Burger",
      description:
        'Double beef, bacon, cheddar, and secret "rage quit" sauce (can be replaced with another choice of sauce)',
      price: 14.99,
      category: "main_course",
      available: true,
      isSpecial: true,
    },
    {
      name: "The NPC Classic",
      description:
        "Simple cheeseburger for those who just follow the main quest",
      price: 10.99,
      category: "main_course",
      available: true,
      isSpecial: false,
    },
    {
      name: "Side Quest Chicken Sandwich",
      description: "Crispy chicken with legendary aioli",
      price: 11.99,
      category: "main_course",
      available: true,
      isSpecial: false,
    },
    {
      name: "Veggie Villager Wrap",
      description: "Grilled veggies, hummus, and XP-infused dressing",
      price: 10.99,
      category: "main_course",
      available: true,
      isSpecial: false,
    },

    // Entrées
    {
      name: "Master Sword Steak",
      description: "12oz ribeye with Triforce butter",
      price: 22.99,
      category: "main_course",
      available: true,
      isSpecial: true,
    },
    {
      name: "Koopa Carbonara",
      description: "Creamy pasta with crispy bacon & Parmesan",
      price: 13.99,
      category: "main_course",
      available: true,
      isSpecial: false,
    },
    {
      name: "Chocobo Fried Chicken",
      description:
        "Golden-fried chicken served with phoenix down sauce (Our inhouse BBQ Sauce)",
      price: 14.99,
      category: "main_course",
      available: true,
      isSpecial: false,
    },
    {
      name: "Red Shell Ribs",
      description: "BBQ ribs that never miss the flavor mark",
      price: 18.99,
      category: "main_course",
      available: true,
      isSpecial: false,
    },

    // Sides
    {
      name: "Golden Fries",
      description: "Extra crispy with pixelated perfection",
      price: 4.99,
      category: "side",
      available: true,
      isSpecial: false,
    },
    {
      name: "Mana Mac & Cheese",
      description: "Ultra cheesy goodness for spellcasters",
      price: 5.99,
      category: "side",
      available: true,
      isSpecial: false,
    },
    {
      name: "8-Bit Onion Rings",
      description: "Crunchy and addictive, just like a classic arcade game",
      price: 5.99,
      category: "side",
      available: true,
      isSpecial: false,
    },

    // Desserts
    {
      name: "Pixel Pie",
      description:
        'Classic apple pie with a digital twist (a secret recipe created by the original Willy "Game Over" Witchell)',
      price: 6.99,
      category: "dessert",
      available: true,
      isSpecial: false,
    },
    {
      name: "Loot Crate Lava Cake",
      description: "Chocolate explosion of sweetness",
      price: 7.99,
      category: "dessert",
      available: true,
      isSpecial: true,
    },
    {
      name: "Starman Sundae",
      description: "Vanilla ice cream, sprinkles, and invincibility",
      price: 5.99,
      category: "dessert",
      available: true,
      isSpecial: false,
    },

    // Drinks
    {
      name: "Mana Potion",
      description: "Blue Raspberry Slush",
      price: 3.99,
      category: "drink",
      available: true,
      isSpecial: false,
    },
    {
      name: "Health Potion",
      description: "Strawberry Lemonade",
      price: 3.99,
      category: "drink",
      available: true,
      isSpecial: false,
    },
    {
      name: "Final Fantasy Float",
      description: "Root Beer & Ice Cream",
      price: 4.99,
      category: "drink",
      available: true,
      isSpecial: true,
    },
    {
      name: "Soda with Free Refills",
      description:
        "Choose from: Mana Mist, Health Tonic, Mountain Doom, Red Ring Rush, Nuka Fizz, and more",
      price: 1.99,
      category: "drink",
      available: true,
      isSpecial: false,
    },
  ];

  for (const item of menuItems) {
    await storage.createMenuItem(item);
  }
};
