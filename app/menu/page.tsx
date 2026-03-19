"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import MenuSearch from "@/components/MenuSearch";
import MenuFilters, { SortOption } from "@/components/MenuFilters";
import MenuCategory from "@/components/MenuCategory";
import AuthNav from "@/components/AuthNav";

type MenuCategory = "Starters" | "Mains" | "Desserts";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  numPrice: number;
  category: MenuCategory;
}

const menuItems: MenuItem[] = [
  // Starters
  {
    name: "Smoked Oyster Velvet",
    description: "Cold poached oyster, citrus pearls, fennel ash, and sea herb oil.",
    price: "$16",
    numPrice: 16,
    category: "Starters",
  },
  {
    name: "Golden Beet Carpaccio",
    description: "Thin sliced beets, whipped ricotta, pistachio dust, and citrus mist.",
    price: "$14",
    numPrice: 14,
    category: "Starters",
  },
  {
    name: "Amaara Brioche",
    description: "Warm butter brioche with saffron cultured cream and truffle honey.",
    price: "$12",
    numPrice: 12,
    category: "Starters",
  },
  // Mains
  {
    name: "Charcoal Cod Symphony",
    description: "Miso glazed cod, roasted leek, yuzu beurre blanc, and baby cress.",
    price: "$34",
    numPrice: 34,
    category: "Mains",
  },
  {
    name: "Lamb Nocturne",
    description: "Slow-cooked lamb loin, burnt carrot puree, black garlic glaze.",
    price: "$38",
    numPrice: 38,
    category: "Mains",
  },
  {
    name: "Wild Mushroom Risotto",
    description: "Aged arborio rice, forest mushrooms, pecorino espuma, and sage oil.",
    price: "$30",
    numPrice: 30,
    category: "Mains",
  },
  // Desserts
  {
    name: "Chocolate Enigma",
    description: "Dark chocolate mousse, raspberry gel, gold leaf, and crispy tuile.",
    price: "$12",
    numPrice: 12,
    category: "Desserts",
  },
  {
    name: "Lavender Panna Cotta",
    description: "Silky lavender panna cotta, fig compote, and pistachio crumble.",
    price: "$11",
    numPrice: 11,
    category: "Desserts",
  },
  {
    name: "Citrus Yuzu Sphere",
    description: "Yuzu citrus sphere, passion fruit coulis, and vanilla air.",
    price: "$14",
    numPrice: 14,
    category: "Desserts",
  },
];

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60]);
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const filteredAndSortedItems = useMemo(() => {
    let filtered = menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice =
        item.numPrice >= priceRange[0] && item.numPrice <= priceRange[1];

      return matchesSearch && matchesPrice;
    });

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price-low") {
        return a.numPrice - b.numPrice;
      } else if (sortBy === "price-high") {
        return b.numPrice - a.numPrice;
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, priceRange, sortBy]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const grouped: Record<MenuCategory, MenuItem[]> = {
      Starters: [],
      Mains: [],
      Desserts: [],
    };

    filteredAndSortedItems.forEach((item) => {
      grouped[item.category].push(item);
    });

    return grouped;
  }, [filteredAndSortedItems]);

  return (
    <div className="min-h-screen bg-black">
      <AuthNav />

      <main className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-gray-400">
            Discover the finest culinary creations at Amaara
          </p>
        </motion.div>

        {/* Search and Filters */}
        <MenuSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <MenuFilters
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          maxPrice={60}
        />

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-gray-400 text-sm"
        >
          Showing {filteredAndSortedItems.length} of {menuItems.length} items
        </motion.div>

        {/* Menu Categories */}
        {filteredAndSortedItems.length > 0 ? (
          <div>
            {(["Starters", "Mains", "Desserts"] as MenuCategory[]).map(
              (category, index) =>
                groupedItems[category].length > 0 && (
                  <MenuCategory
                    key={category}
                    title={category}
                    items={groupedItems[category].map((item) => ({
                      name: item.name,
                      description: item.description,
                      price: item.price,
                    }))}
                    categoryIndex={index}
                  />
                )
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-400 text-lg">
              No items match your search criteria. Try adjusting your filters.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
