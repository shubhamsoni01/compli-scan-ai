export type ProductCategory = 'food' | 'edible-oil' | 'cosmetics' | 'household' | 'other';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  imageUrl: string;
  description: string;
}

export const productCategories: { value: ProductCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'Food', icon: 'UtensilsCrossed' },
  { value: 'edible-oil', label: 'Edible Oil', icon: 'Droplets' },
  { value: 'cosmetics', label: 'Cosmetics', icon: 'Sparkles' },
  { value: 'household', label: 'Household', icon: 'Home' },
  { value: 'other', label: 'Other', icon: 'Package' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Uncle Chips Spicy Treat',
    brand: 'Uncle Chips',
    category: 'food',
    imageUrl: '/products/uncle-chips.jpg',
    description: 'Spicy flavored potato chips, 52g pack',
  },
  {
    id: 'prod_002',
    name: 'Clinic Plus Strong & Long Shampoo',
    brand: 'Clinic Plus',
    category: 'cosmetics',
    imageUrl: '/products/clinic-plus.jpg',
    description: 'Health shampoo with milk proteins, 175ml',
  },
  {
    id: 'prod_003',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Fortune',
    category: 'edible-oil',
    imageUrl: '/products/fortune-oil.jpg',
    description: 'Refined sunflower oil, 1L pouch',
  },
  {
    id: 'prod_004',
    name: 'Surf Excel Matic Top Load',
    brand: 'Surf Excel',
    category: 'household',
    imageUrl: '/products/surf-excel.jpg',
    description: 'Washing powder for top load machines, 1kg',
  },
  {
    id: 'prod_005',
    name: 'Dove Beauty Bathing Bar',
    brand: 'Dove',
    category: 'cosmetics',
    imageUrl: '/products/dove-soap.jpg',
    description: 'Moisturizing beauty bar with ¼ cream, 100g',
  },
  {
    id: 'prod_006',
    name: 'Parle-G Gold Biscuits',
    brand: 'Parle',
    category: 'food',
    imageUrl: '/products/parle-g.jpg',
    description: 'Glucose biscuits, 100g pack',
  },
  {
    id: 'prod_007',
    name: 'Saffola Gold Blended Oil',
    brand: 'Saffola',
    category: 'edible-oil',
    imageUrl: '/products/saffola.jpg',
    description: 'Blended edible vegetable oil, 1L',
  },
  {
    id: 'prod_008',
    name: 'Himalaya Neem Face Wash',
    brand: 'Himalaya',
    category: 'cosmetics',
    imageUrl: '/products/himalaya-neem.jpg',
    description: 'Purifying neem face wash, 150ml',
  },
  {
    id: 'prod_009',
    name: 'Maggi 2-Minute Noodles',
    brand: 'Maggi',
    category: 'food',
    imageUrl: '/products/maggi.jpg',
    description: 'Instant noodles masala flavor, 70g',
  },
  {
    id: 'prod_010',
    name: 'Harpic Power Plus',
    brand: 'Harpic',
    category: 'household',
    imageUrl: '/products/harpic.jpg',
    description: 'Toilet cleaner disinfectant, 500ml',
  },
];
