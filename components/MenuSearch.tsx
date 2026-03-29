"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

const MenuSearch: FC<MenuSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search menu items...",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-8"
    >
      <div className="relative group">
        <svg
          className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-amber-400 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          aria-label="Search"
          aria-describedby={searchTerm ? "clear-search-btn" : undefined}
        />
        {searchTerm && (
          <button
            id="clear-search-btn"
            onClick={() => onSearchChange("")}
            type="button"
            aria-label="Clear search"
            className="absolute right-4 top-3.5 text-gray-400 hover:text-white hover:bg-gray-700/50 p-1 rounded transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MenuSearch;
