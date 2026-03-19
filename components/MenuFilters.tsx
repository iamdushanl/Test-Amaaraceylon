"use client";

import { motion } from "framer-motion";
import { FC } from "react";

export type SortOption = "name" | "price-low" | "price-high";

interface MenuFiltersProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  maxPrice?: number;
}

const MenuFilters: FC<MenuFiltersProps> = ({
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  maxPrice = 60,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-700"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-white mb-4">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) =>
                  onPriceChange([
                    parseInt(e.target.value),
                    priceRange[1],
                  ])
                }
                className="w-full accent-amber-500"
              />
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange([
                    priceRange[0],
                    parseInt(e.target.value),
                  ])
                }
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-semibold text-white mb-4">
            Sort By
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "name" as SortOption, label: "Name" },
              { value: "price-low" as SortOption, label: "Price: Low" },
              { value: "price-high" as SortOption, label: "Price: High" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  sortBy === option.value
                    ? "bg-amber-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuFilters;
