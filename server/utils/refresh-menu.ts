import { storage } from '../storage';
import { MongoClient } from 'mongodb';

// Get MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Script to refresh menu items with the gaming-themed items
 */
async function refreshMenu() {
  console.log('Refreshing menu items...');

  try {
    // Connect directly to MongoDB to drop the collection
    const client = new MongoClient(MONGODB_URI!);
    await client.connect();
    const db = client.db();
    
    // Drop existing menu_items collection
    try {
      await db.collection('menuItems').drop();
      console.log('Dropped existing menuItems collection');
    } catch (error) {
      console.log('Collection might not exist yet, continuing...');
    }
    
    // Add new gaming-themed menu items
    const menuItems = [
      // APPETIZERS
      {
        name: 'Power-Up Nachos',
        description: 'Loaded with cheese, jalapeños, and XP-boosting guac!',
        price: '9.99',
        category: 'appetizer',
        available: true,
        isSpecial: false
      },
      {
        name: 'Health Potion Soup',
        description: 'Tomato basil with a mana-restoring swirl of cream',
        price: '6.99',
        category: 'appetizer',
        available: true,
        isSpecial: false
      },
      {
        name: '1-Up Mushroom Bites',
        description: 'Fried mushroom caps with a side of pixel sauce (Our own Cajun mix)',
        price: '7.99',
        category: 'appetizer',
        available: true,
        isSpecial: false
      },
      {
        name: 'Boss Battle Wings',
        description: 'Spicy buffalo wings that pack a punch (A blend of Tabasco and jalapeño)!',
        price: '11.99',
        category: 'appetizer',
        available: true,
        isSpecial: true
      },
      
      // BURGERS & SANDWICHES
      {
        name: 'Final Boss Burger',
        description: 'Double beef, bacon, cheddar, and secret "rage quit" sauce (can be replaced with another choice of sauce)',
        price: '14.99',
        category: 'burger',
        available: true,
        isSpecial: true
      },
      {
        name: 'The NPC Classic',
        description: 'Simple cheeseburger for those who just follow the main quest',
        price: '10.99',
        category: 'burger',
        available: true,
        isSpecial: false
      },
      {
        name: 'Side Quest Chicken Sandwich',
        description: 'Crispy chicken with legendary aioli',
        price: '11.99',
        category: 'burger',
        available: true,
        isSpecial: false
      },
      {
        name: 'Veggie Villager Wrap',
        description: 'Grilled veggies, hummus, and XP-infused dressing',
        price: '10.99',
        category: 'burger',
        available: true,
        isSpecial: false
      },
      
      // ENTRÉES
      {
        name: 'Master Sword Steak',
        description: '12oz ribeye with Triforce butter',
        price: '22.99',
        category: 'main_course',
        available: true,
        isSpecial: true
      },
      {
        name: 'Koopa Carbonara',
        description: 'Creamy pasta with crispy bacon & Parmesan',
        price: '13.99',
        category: 'main_course',
        available: true,
        isSpecial: false
      },
      {
        name: 'Chocobo Fried Chicken',
        description: 'Golden-fried chicken served with phoenix down sauce (Our inhouse BBQ Sauce)',
        price: '14.99',
        category: 'main_course',
        available: true,
        isSpecial: false
      },
      {
        name: 'Red Shell Ribs',
        description: 'BBQ ribs that never miss the flavor mark',
        price: '18.99',
        category: 'main_course',
        available: true,
        isSpecial: false
      },
      
      // SIDES
      {
        name: 'Golden Fries',
        description: 'Extra crispy with pixelated perfection',
        price: '4.99',
        category: 'side',
        available: true,
        isSpecial: false
      },
      {
        name: 'Mana Mac & Cheese',
        description: 'Ultra cheesy goodness for spellcasters',
        price: '5.99',
        category: 'side',
        available: true,
        isSpecial: false
      },
      {
        name: '8-Bit Onion Rings',
        description: 'Crunchy and addictive, just like a classic arcade game',
        price: '5.99',
        category: 'side',
        available: true,
        isSpecial: false
      },
      
      // DESSERTS
      {
        name: 'Pixel Pie',
        description: 'Classic apple pie with a digital twist (a secret recipe created by the original Willy "Game Over" Witchell)',
        price: '6.99',
        category: 'dessert',
        available: true,
        isSpecial: false
      },
      {
        name: 'Loot Crate Lava Cake',
        description: 'Chocolate explosion of sweetness',
        price: '7.99',
        category: 'dessert',
        available: true,
        isSpecial: false
      },
      {
        name: 'Starman Sundae',
        description: 'Vanilla ice cream, sprinkles, and invincibility',
        price: '5.99',
        category: 'dessert',
        available: true,
        isSpecial: false
      },
      
      // DRINKS
      {
        name: 'Mana Potion',
        description: 'Blue Raspberry Slush',
        price: '3.99',
        category: 'drink',
        available: true,
        isSpecial: false
      },
      {
        name: 'Health Potion',
        description: 'Strawberry Lemonade',
        price: '3.99',
        category: 'drink',
        available: true,
        isSpecial: false
      },
      {
        name: 'Final Fantasy Float',
        description: 'Root Beer & Ice Cream',
        price: '4.99',
        category: 'drink',
        available: true,
        isSpecial: true
      },
      {
        name: 'Soda with Free Refills',
        description: 'Flavors: Mana Mist, Health Tonic, Mountain Doom, Red Ring Rush, Nuka Fizz, Hyper Potion Pop, Starman Sparkle, Turbo Cola, 8-Bit Berry Blast, Respawn Root Beer, Koopa Kola, Final Fizzasy, Warp Pipe Watermelon, XP Elixir, Lag-Free Lemon-Lime, Dragonborn Drank, Checkpoint Cherry, Glitch Grape, Pixel Punch, Overclock Orange',
        price: '1.99',
        category: 'drink',
        available: true,
        isSpecial: false
      }
    ];
    
    // Create each menu item
    for (const item of menuItems) {
      await storage.createMenuItem(item);
      console.log(`Added menu item: ${item.name}`);
    }
    
    console.log('Menu refresh completed successfully');
    await client.close();
    
  } catch (error) {
    console.error('Error refreshing menu:', error);
  }
}

// Run the function
refreshMenu();