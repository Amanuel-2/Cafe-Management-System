import {
  MenuCategory,
  MenuItem,
  Order,
  InventoryItem,
  Employee,
  Notification,
  ReportMetric,
  Supplier,
  TimelineEvent,
} from '../types';

const categories: MenuCategory[] = [
  { id: 'coffee', name: 'ቡና / Qophee', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' },
  { id: 'breakfast', name: 'Breakfast', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200' },
  { id: 'lunch', name: 'Lunch', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' },
  { id: 'dessert', name: 'Dessert', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200' },
  { id: 'drinks', name: 'ጁስ / Juusii', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200' },
  { id: 'snacks', name: 'Snacks', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' },
  { id: 'pasta', name: 'ፓስታ / Pastaa', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' },
  { id: 'grains', name: 'እህል / Midhaan', color: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-200' },
  { id: 'stews', name: 'ጎንዮሽ ምግቦች / Suufii', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' },
  { id: 'bread', name: 'ዳቦ / Daabbhoo', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' },
  { id: 'chips', name: 'ቺፕስ / Chipsii', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' },
  { id: 'special-stews', name: 'ስፔሻል ፍቱፍቱ / Special Fithuuftuu', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' },
  { id: 'shawarma', name: 'ሻዋርማ / Shawarmaa', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200' },
  { id: 'desserts-snacks', name: 'መክሰስ / Quraatsumii', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200' },
  { id: 'chicken', name: 'ዶሮ / Chikken', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' },
];

export const menuItems: MenuItem[] = [
  { id: 'm1', name: 'Cappuccino', categoryId: 'coffee', price: 4.5, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm2', name: 'Avocado Toast', categoryId: 'breakfast', price: 9.75, image: 'https://images.unsplash.com/photo-1603046891744-1f76eb10aec5?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm3', name: 'Chicken Panini', categoryId: 'lunch', price: 12.5, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm4', name: 'Berry Tart', categoryId: 'dessert', price: 6.25, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 4 },
  { id: 'm5', name: 'Espresso', categoryId: 'coffee', price: 3.0, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d70ca8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 2 },
  { id: 'm6', name: 'Latte', categoryId: 'coffee', price: 5.0, image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 4 },
  { id: 'm7', name: 'Mocha', categoryId: 'coffee', price: 5.5, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm8', name: 'Americano', categoryId: 'coffee', price: 3.5, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 2 },
  { id: 'm9', name: 'Pancakes', categoryId: 'breakfast', price: 8.5, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 10 },
  { id: 'm10', name: 'French Toast', categoryId: 'breakfast', price: 9.0, image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 9 },
  { id: 'm11', name: 'Egg Benedict', categoryId: 'breakfast', price: 11.0, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm12', name: 'Caesar Salad', categoryId: 'lunch', price: 10.0, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm13', name: 'Margherita Pizza', categoryId: 'lunch', price: 14.0, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 15 },
  { id: 'm14', name: 'Club Sandwich', categoryId: 'lunch', price: 11.5, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 10 },
  { id: 'm15', name: 'Chocolate Cake', categoryId: 'dessert', price: 7.0, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 6 },
  { id: 'm16', name: 'Tiramisu', categoryId: 'dessert', price: 7.5, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm17', name: 'Ice Cream Sundae', categoryId: 'dessert', price: 6.5, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 3 },
  { id: 'm18', name: 'Fresh Orange Juice', categoryId: 'drinks', price: 4.0, image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 2 },
  { id: 'm19', name: 'Iced Tea', categoryId: 'drinks', price: 3.5, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 1 },
  { id: 'm20', name: 'Smoothie', categoryId: 'drinks', price: 5.5, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 3 },
  { id: 'm21', name: 'Flat White', categoryId: 'coffee', price: 4.75, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 4 },
  { id: 'm22', name: 'Croissant', categoryId: 'breakfast', price: 4.25, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm23', name: 'Bagel with Cream Cheese', categoryId: 'breakfast', price: 5.5, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 3 },
  { id: 'm24', name: 'Tomato Soup', categoryId: 'lunch', price: 6.5, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm25', name: 'Grilled Cheese', categoryId: 'lunch', price: 7.5, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 6 },
  { id: 'm26', name: 'Cheesecake', categoryId: 'dessert', price: 8.0, image: 'https://images.unsplash.com/photo-1578775787604-39475550a69e?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 10 },
  { id: 'm27', name: 'Lemonade', categoryId: 'drinks', price: 3.75, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 1 },
  { id: 'm28', name: 'French Fries', categoryId: 'snacks', price: 4.25, image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 7 },
  { id: 'm29', name: 'Onion Rings', categoryId: 'snacks', price: 5.0, image: 'https://images.unsplash.com/photo-1639024471283-03518883a5c0?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm30', name: 'Mozzarella Sticks', categoryId: 'snacks', price: 6.25, image: 'https://images.unsplash.com/photo-1574866928860-07799a940c16?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 9 },
  // Ethiopian Coffee Items
  { id: 'm31', name: 'ኤስፕሬሶ (Espresso)', categoryId: 'coffee', price: 170, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d70ca8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 2 },
  { id: 'm32', name: 'ማኪያቶ (Macchiato)', categoryId: 'coffee', price: 170, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 3 },
  { id: 'm33', name: 'ላቴ ማኪያቶ (Latte Macchiato)', categoryId: 'coffee', price: 170, image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 4 },
  { id: 'm34', name: 'ፍላት ዋይት (Flat White)', categoryId: 'coffee', price: 170, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 4 },
  { id: 'm35', name: 'ካፑቺኖ ስፔሻል (Cappuccino Special)', categoryId: 'coffee', price: 190, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 6 },
  { id: 'm36', name: 'ካፌ ሞካ (Caffè Mocha)', categoryId: 'coffee', price: 200, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm37', name: 'አይስድ ኮፊ (Iced Coffee)', categoryId: 'coffee', price: 200, image: 'https://images.unsplash.com/photo-1517701604593-2831267790ec?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 3 },
  { id: 'm38', name: 'አይስድ ሞካ (Iced Mocha)', categoryId: 'coffee', price: 200, image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 3 },
  // Ethiopian Drinks
  { id: 'm39', name: 'ስሙዚ (Smoothie)', categoryId: 'drinks', price: 230, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 4 },
  { id: 'm40', name: 'ኮክቴል (Cocktail)', categoryId: 'drinks', price: 280, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm41', name: 'ፍራፔ (Frappé)', categoryId: 'drinks', price: 230, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  // Ethiopian Pasta
  { id: 'm42', name: 'ፓስታ ፍቱፍቱ (Pastaa Fithuuftuu)', categoryId: 'pasta', price: 170, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm43', name: 'ፓስታ ቀ (Pastaa Qaa)', categoryId: 'pasta', price: 210, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 14 },
  { id: 'm44', name: 'ፓስታ ቅቤፋን (Pastaa Kibeefaan)', categoryId: 'pasta', price: 170, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm45', name: 'ፓስታ ሽሮ (Pastaa Shiroo)', categoryId: 'pasta', price: 210, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 14 },
  { id: 'm46', name: 'ፓስታ ሃንጋሲ (Pastaa Hangaasii)', categoryId: 'pasta', price: 170, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm47', name: 'ፓስታ ኢፍቲን (Pastaa Iftiin)', categoryId: 'pasta', price: 170, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm48', name: 'ፓስታ ኢፍቲን በቀ (Pastaa Iftiin Baqqaa)', categoryId: 'pasta', price: 170, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 13 },
  // Ethiopian Grains/Rice
  { id: 'm49', name: 'በቀ ፍቱፍቱ (Baqqaa Fithuuftuu)', categoryId: 'grains', price: 250, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 15 },
  { id: 'm50', name: 'በቀ ቀ (Baqqaa Qaa)', categoryId: 'grains', price: 100, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm51', name: 'በቀ ቅቤፋን (Baqqaa Kibeefaan)', categoryId: 'grains', price: 170, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 10 },
  { id: 'm52', name: 'በቀ ሽሮ (Baqqaa Shiroo)', categoryId: 'grains', price: 100, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm53', name: 'በቀ ሃንጋሲ (Baqqaa Hangaasii)', categoryId: 'grains', price: 100, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm54', name: 'በቀ ኢፍቲን (Baqqaa Iftiin)', categoryId: 'grains', price: 100, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm55', name: 'በቀ ኢፍቲን በቀ (Baqqaa Iftiin Baqqaa)', categoryId: 'grains', price: 100, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 9 },
  // Ethiopian Stews
  { id: 'm56', name: 'ፍቱፍቱ (Fithuuftuu)', categoryId: 'stews', price: 300, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 18 },
  { id: 'm57', name: 'በቀ (Baqqaa)', categoryId: 'stews', price: 500, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 25 },
  // Ethiopian Bread/Sandwiches
  { id: 'm58', name: 'ሳንድዊች (Sandwich - Plain)', categoryId: 'bread', price: 170, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 5 },
  { id: 'm59', name: 'ሳንድዊች በዶሮ (Sandwich - Chicken)', categoryId: 'bread', price: 180, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 7 },
  // Ethiopian Chips
  { id: 'm60', name: 'ቺፕስ (Chipsii)', categoryId: 'chips', price: 110, image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 6 },
  // Ethiopian Special Stews
  { id: 'm61', name: 'ፍቱፍቱ (Fithuuftuu)', categoryId: 'special-stews', price: 350, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 20 },
  { id: 'm62', name: 'ፍቱፍቱ ስፔሻል (Fithuuftuu Special)', categoryId: 'special-stews', price: 380, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 22 },
  { id: 'm63', name: 'ፍቱፍቱ ሃንጋሲ (Fithuuftuu Hangaasii)', categoryId: 'special-stews', price: 350, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 20 },
  { id: 'm64', name: 'ፍቱፍቱ ዳቦ (Fithuuftuu Daabbhoo)', categoryId: 'special-stews', price: 350, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 20 },
  { id: 'm65', name: 'ፍቱፍቱ በቀ (Fithuuftuu Baqqaa)', categoryId: 'special-stews', price: 350, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 20 },
  { id: 'm66', name: 'ፍቱፍቱ በቀ ስፔሻል (Fithuuftuu Baqqaa Special)', categoryId: 'special-stews', price: 380, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 23 },
  // Ethiopian Shawarma
  { id: 'm67', name: 'ሻዋርማ (Shawarmaa)', categoryId: 'shawarma', price: 350, image: 'https://images.unsplash.com/photo-1598023696453-6ca887da099b?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm68', name: 'ሻዋርማ ስፔሻል (Shawarmaa Special)', categoryId: 'shawarma', price: 390, image: 'https://images.unsplash.com/photo-1598023696453-6ca887da099b?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 14 },
  { id: 'm69', name: 'ሻዋርማ ቺፕስ (Shawarmaa Chipsi)', categoryId: 'shawarma', price: 390, image: 'https://images.unsplash.com/photo-1598023696453-6ca887da099b?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 14 },
  { id: 'm70', name: 'ሻዋርማ ዮኒ (Shawarmaa Yoomii)', categoryId: 'shawarma', price: 390, image: 'https://images.unsplash.com/photo-1598023696453-6ca887da099b?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 14 },
  // Ethiopian Desserts/Snacks
  { id: 'm71', name: 'ኬክ (Keekii)', categoryId: 'desserts-snacks', price: 110, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 8 },
  { id: 'm72', name: 'ሳምቡሳ (Sambuusa)', categoryId: 'desserts-snacks', price: 80, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 10 },
  { id: 'm73', name: 'ፒዜታ (Pizzeta)', categoryId: 'desserts-snacks', price: 170, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 12 },
  { id: 'm74', name: 'በቀ ቲካ (Baqqaa Tika)', categoryId: 'desserts-snacks', price: 170, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 10 },
  // Ethiopian Chicken
  { id: 'm75', name: 'ዶሮ (Chikken)', categoryId: 'chicken', price: 900, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 30 },
  { id: 'm76', name: 'የዶሮ በሪያን (Chikken Biryaan)', categoryId: 'chicken', price: 900, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 35 },
  { id: 'm77', name: 'የዶሮ ክንፍ (Chikken Wiingii)', categoryId: 'chicken', price: 900, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 25 },
  { id: 'm78', name: 'የአሩዙ ዶሮ (Arraayisuu Lukkuu)', categoryId: 'chicken', price: 1500, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 40 },
  { id: 'm79', name: 'የአሩዙ ዶሮ ግማሽ (Arraayisuu Lukkuu Walakkaa)', categoryId: 'chicken', price: 800, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80', available: true, prepTimeMinutes: 35 },
];

const generateTimeline = (order: Partial<Order>): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    { id: 't1', title: 'Order Created', timestamp: order.createdAt as string, completed: true },
  ];
  if (order.acceptedAt) {
    events.push({ id: 't2', title: 'Chef Accepted', timestamp: order.acceptedAt, completed: true });
  }
  if (order.readyAt) {
    events.push({ id: 't3', title: 'Preparing', timestamp: order.readyAt, completed: true });
  }
  if (order.servedAt) {
    events.push({ id: 't4', title: 'Served', timestamp: order.servedAt, completed: true });
  }
  if (order.paidAt) {
    events.push({ id: 't5', title: 'Paid', timestamp: order.paidAt, completed: true });
  }
  return events;
};

const initialOrders: Order[] = [
  {
    id: 'ORD-1042',
    receiptNumber: 'RCP-2026-1042',
    table: 'T-07',
    waiterName: 'Maya',
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    subtotal: 27,
    tax: 2.16,
    discount: 0,
    total: 29.16,
    items: [
      { id: 'oi1', menuItemId: 'm1', name: 'Cappuccino', image: menuItems[0].image, price: 4.5, quantity: 2, status: 'pending' },
      { id: 'oi2', menuItemId: 'm2', name: 'Avocado Toast', image: menuItems[1].image, price: 9.75, quantity: 2, notes: 'No chili flakes', status: 'pending' },
    ],
    timeline: [],
  },
  {
    id: 'ORD-1043',
    receiptNumber: 'RCP-2026-1043',
    table: 'T-03',
    waiterName: 'Noah',
    status: 'preparing',
    paymentStatus: 'unpaid',
    paymentMethod: 'telebirr',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    acceptedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    subtotal: 18.75,
    tax: 1.5,
    discount: 0,
    total: 20.25,
    items: [
      { id: 'oi3', menuItemId: 'm3', name: 'Chicken Panini', image: menuItems[2].image, price: 12.5, quantity: 1, status: 'preparing' },
      { id: 'oi4', menuItemId: 'm4', name: 'Berry Tart', image: menuItems[3].image, price: 6.25, quantity: 1, status: 'ready' },
    ],
    timeline: [],
  },
].map(order => ({ ...order, timeline: generateTimeline(order) }));

const employees: Employee[] = [
  { id: 'e1', name: 'Ava Thompson', role: 'Manager', email: 'ava@cafe.test', status: 'active' },
  { id: 'e2', name: 'Maya Chen', role: 'Waiter', email: 'maya@cafe.test', status: 'active' },
  { id: 'e3', name: 'Leo Martin', role: 'Chef', email: 'leo@cafe.test', status: 'active' },
];

const suppliers: Supplier[] = [
  { id: 's1', name: 'Fresh Fields', contact: 'Nora Lee', phone: '+1 555 0142' },
  { id: 's2', name: 'Roast Works', contact: 'Omar Wells', phone: '+1 555 0188' },
];

const inventory: InventoryItem[] = [
  { id: 'i1', name: 'Espresso Beans', category: 'Coffee', unit: 'kg', stock: 18, parLevel: 12, supplierId: 's2' },
  { id: 'i2', name: 'Sourdough', category: 'Bakery', unit: 'loaves', stock: 8, parLevel: 10, supplierId: 's1' },
  { id: 'i3', name: 'Avocados', category: 'Produce', unit: 'pcs', stock: 22, parLevel: 18, supplierId: 's1' },
];

const notifications: Notification[] = [
  { id: 'n1', title: 'Order ready', description: 'ORD-1043 has one item ready for pickup.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), type: 'order' },
];

const reports: ReportMetric[] = [
  { id: 'r1', label: 'Today sales', value: '$2,840', change: '+12%', trend: 'up' },
  { id: 'r2', label: 'Open orders', value: '18', change: '+4', trend: 'up' },
  { id: 'r3', label: 'Avg ticket', value: '$18.70', change: '-3%', trend: 'down' },
];

interface Store {
  orders: Order[];
  categories: MenuCategory[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  employees: Employee[];
  suppliers: Supplier[];
  notifications: Notification[];
  reports: ReportMetric[];
}

export const store: Store = {
  orders: initialOrders,
  categories,
  menuItems,
  inventory,
  employees,
  suppliers,
  notifications,
  reports,
};
