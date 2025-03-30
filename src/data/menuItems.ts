
import { MenuItem, Category } from '@/types';

export const categories: Category[] = [
  { id: 'burgers', name: 'Burgers', type: 'food', image: '/images/category-burgers.jpg' },
  { id: 'pizza', name: 'Pizza', type: 'food', image: '/images/category-pizza.jpg' },
  { id: 'wraps', name: 'Wraps', type: 'food', image: '/images/category-wraps.jpg' },
  { id: 'sides', name: 'Sides', type: 'food', image: '/images/category-sides.jpg' },
  { id: 'fruit-juice', name: 'Fruit Juice', type: 'juice', image: '/images/category-fruit-juices.jpg' },
  { id: 'smoothies', name: 'Smoothies', type: 'juice', image: '/images/category-smoothies.jpg' },
  { id: 'special-drinks', name: 'Special Drinks', type: 'juice', image: '/images/category-special-drinks.jpg' },
];

export const menuItems: MenuItem[] = [
  // Burgers
  {
    id: 'classic-burger',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomatoes, cheese, and our special sauce',
    price: 8.99,
    image: '/images/classic-burger.jpg',
    category: 'food',
    tags: ['burgers', 'beef', 'popular'],
    popular: true
  },
  {
    id: 'double-cheese-burger',
    name: 'Double Cheeseburger',
    description: 'Two beef patties with double cheese, pickles, onions, and our signature sauce',
    price: 11.99,
    image: '/images/double-cheeseburger.jpg',
    category: 'food',
    tags: ['burgers', 'beef', 'cheese']
  },
  {
    id: 'chicken-burger',
    name: 'Crispy Chicken Burger',
    description: 'Crispy fried chicken with coleslaw, pickles and mayo',
    price: 9.99,
    image: '/images/chicken-burger.jpg',
    category: 'food',
    tags: ['burgers', 'chicken']
  },
  {
    id: 'veggie-burger',
    name: 'Veggie Burger',
    description: 'Plant-based patty with avocado, sprouts, and vegan mayo',
    price: 9.49,
    image: '/images/veggie-burger.jpg',
    category: 'food',
    tags: ['burgers', 'vegetarian']
  },
  
  // Pizzas
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
    price: 12.99,
    image: '/images/margherita-pizza.jpg',
    category: 'food',
    tags: ['pizza', 'vegetarian', 'popular'],
    popular: true
  },
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza topped with spicy pepperoni slices',
    price: 14.99,
    image: '/images/pepperoni-pizza.jpg',
    category: 'food',
    tags: ['pizza', 'meat']
  },
  {
    id: 'supreme-pizza',
    name: 'Supreme Pizza',
    description: 'Loaded with pepperoni, sausage, bell peppers, olives, and onions',
    price: 16.99,
    image: '/images/supreme-pizza.jpg',
    category: 'food',
    tags: ['pizza', 'meat']
  },
  
  // Wraps
  {
    id: 'chicken-wrap',
    name: 'Grilled Chicken Wrap',
    description: 'Grilled chicken with fresh vegetables and ranch dressing',
    price: 9.49,
    image: '/images/chicken-wrap.jpg',
    category: 'food',
    tags: ['wraps', 'chicken']
  },
  {
    id: 'falafel-wrap',
    name: 'Falafel Wrap',
    description: 'Crispy falafel with tahini sauce, tomatoes, and lettuce',
    price: 8.99,
    image: '/images/falafel-wrap.jpg',
    category: 'food',
    tags: ['wraps', 'vegetarian']
  },
  
  // Sides
  {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Crispy golden fries seasoned to perfection',
    price: 3.99,
    image: '/images/french-fries.jpg',
    category: 'food',
    tags: ['sides', 'vegetarian', 'popular'],
    popular: true
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings with dipping sauce',
    price: 4.99,
    image: '/images/onion-rings.jpg',
    category: 'food',
    tags: ['sides', 'vegetarian']
  },
  
  // Fruit Juices
  {
    id: 'orange-juice',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice full of vitamin C',
    price: 4.49,
    image: '/images/orange-juice.jpg',
    category: 'juice',
    tags: ['fruit-juice', 'popular'],
    popular: true
  },
  {
    id: 'apple-juice',
    name: 'Apple Juice',
    description: 'Sweet and refreshing apple juice from local orchards',
    price: 4.29,
    image: '/images/apple-juice.jpg',
    category: 'juice',
    tags: ['fruit-juice']
  },
  {
    id: 'watermelon-juice',
    name: 'Watermelon Juice',
    description: 'Refreshing watermelon juice, perfect for hot days',
    price: 4.99,
    image: '/images/watermelon-juice.jpg',
    category: 'juice',
    tags: ['fruit-juice']
  },
  
  // Smoothies
  {
    id: 'berry-smoothie',
    name: 'Mixed Berry Smoothie',
    description: 'Blend of strawberries, blueberries, and raspberries with yogurt',
    price: 5.99,
    image: '/images/berry-smoothie.jpg',
    category: 'juice',
    tags: ['smoothies', 'popular'],
    popular: true
  },
  {
    id: 'tropical-smoothie',
    name: 'Tropical Paradise',
    description: 'Mango, pineapple, and banana blended with coconut milk',
    price: 6.49,
    image: '/images/tropical-smoothie.jpg',
    category: 'juice',
    tags: ['smoothies']
  },
  
  // Special Drinks
  {
    id: 'detox-green',
    name: 'Detox Green',
    description: 'Spinach, kale, apple, and ginger for the ultimate detox',
    price: 6.99,
    image: '/images/detox-green.jpg',
    category: 'juice',
    tags: ['special-drinks', 'healthy']
  },
  {
    id: 'energy-boost',
    name: 'Energy Boost',
    description: 'Beet, carrot, apple, and lemon to boost your energy levels',
    price: 6.99,
    image: '/images/energy-boost.jpg',
    category: 'juice',
    tags: ['special-drinks', 'healthy']
  }
];

export const getItemById = (id: string): MenuItem | undefined => {
  return menuItems.find(item => item.id === id);
};

export const getItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter(item => item.tags.includes(categoryId));
};

export const getPopularItems = (): MenuItem[] => {
  return menuItems.filter(item => item.popular === true);
};

export const getFoodItems = (): MenuItem[] => {
  return menuItems.filter(item => item.category === 'food');
};

export const getJuiceItems = (): MenuItem[] => {
  return menuItems.filter(item => item.category === 'juice');
};
