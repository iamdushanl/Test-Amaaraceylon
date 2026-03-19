# Menu Feature Documentation

## Overview

The Menu feature provides a comprehensive, interactive menu browsing experience for Amaara restaurant. Users can search, filter by price range, and sort menu items across multiple categories.

## Components

### MenuItem Component (`components/MenuItem.tsx`)
Displays individual menu items with name, description, and price.

**Features:**
- Smooth fade-in animations on load
- Hover lift effect for better interactivity
- Category badge display
- Responsive grid layout
- Gradient background with border hover effects

**Props:**
- `name: string` - Menu item name
- `description: string` - Item description
- `price: string` - Display price (e.g., "$34")
- `category?: string` - Category label
- `index?: number` - Animation delay index

### MenuCategory Component (`components/MenuCategory.tsx`)
Groups and displays menu items by category with elegant styling.

**Features:**
- Staggered animation for category sections
- Grid layout (1/2/3 columns on mobile/tablet/desktop)
- Category header with accent bar
- Item organization and grouping

**Props:**
- `title: string` - Category name (e.g., "Starters")
- `items: CategoryItem[]` - Array of menu items
- `categoryIndex?: number` - Section animation delay

### MenuSearch Component (`components/MenuSearch.tsx`)
Real-time search functionality for menu items.

**Features:**
- Search across item names and descriptions
- Clear button for quick reset
- Focus states with accent color
- Icon feedback
- Responsive input field

**Props:**
- `searchTerm: string` - Current search input
- `onSearchChange: (term: string) => void` - Callback for search updates
- `placeholder?: string` - Input placeholder text

### MenuFilters Component (`components/MenuFilters.tsx`)
Price range filtering and sorting options.

**Features:**
- Dual range sliders for min/max price
- Three sort options: Name, Price (Low-High), Price (High-Low)
- Interactive button states
- Real-time filter updates

**Props:**
- `priceRange: [number, number]` - Current price range
- `onPriceChange: (range: [number, number]) => void` - Price update callback
- `sortBy: SortOption` - Current sort method
- `onSortChange: (sort: SortOption) => void` - Sort update callback
- `maxPrice?: number` - Maximum price range (default: $60)

## Menu Page (`app/menu/page.tsx`)

The main menu page integrating all components with state management.

### Features

**Search Functionality:**
- Real-time filtering by item name or description
- Case-insensitive searching
- Results count display

**Price Range Filter:**
- Min/max sliders from $0-$60
- Dynamic filtering based on selected range
- Display current range limits

**Sorting Options:**
- **By Name:** Alphabetical order (A-Z)
- **By Price (Low to High):** Most affordable items first
- **By Price (High to Low):** Premium items first

**Categories:**
- **Starters:** Appetizers ($12-$16)
- **Mains:** Main courses ($30-$38)
- **Desserts:** Sweet finales ($11-$14)

### State Management

```typescript
- searchTerm: string - Current search query
- priceRange: [number, number] - Min/max price filter
- sortBy: SortOption - Current sorting method
```

### Menu Data Structure

Each item contains:
```typescript
{
  name: string;        // Item name
  description: string; // Detailed description
  price: string;       // Display price
  numPrice: number;    // Numeric price for filtering
  category: string;    // Category classification
}
```

## Usage

### Accessing the Menu

Navigate to `/menu` route or click the "Menu" link in the navigation.

### Searching

Type in the search box to filter items by name or description. The search is case-insensitive and updates in real-time.

### Filtering by Price

Use the price range sliders to show only items within your budget. Both minimum and maximum prices are adjustable.

### Sorting Results

Select a sort option to reorder displayed items:
- Click "Name" to alphabetize
- Click "Price: Low" for budget-friendly sorting
- Click "Price: High" for premium items first

## Styling

The menu uses:
- **Tailwind CSS** for utility-first styling
- **Dark theme** with amber accents (#c9a84c)
- **Framer Motion** for smooth animations
- **Responsive grid** (1/2/3 columns based on viewport)

## Performance

- Uses `useMemo` for efficient filtering and sorting
- Lazy animations with staggered delays
- Client-side rendering for instant interactivity

## Future Enhancements

- Add to cart functionality
- Dietary restrictions filters (vegetarian, gluten-free, etc.)
- Menu item images
- Item availability status
- User ratings and reviews
- Favorites/bookmarks
- Nutritional information display
- Special items/seasonal menu management
