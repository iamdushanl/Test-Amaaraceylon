"use client";

import { motion } from "framer-motion";
import { FC } from "react";
import MenuItem from "./MenuItem";

interface CategoryItem {
  name: string;
  description: string;
  price: string;
}

interface MenuCategoryProps {
  title: string;
  items: CategoryItem[];
  categoryIndex?: number;
}

const MenuCategory: FC<MenuCategoryProps> = ({
  title,
  items,
  categoryIndex = 0,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: categoryIndex * 0.2 }}
      className="mb-12"
    >
      <div className="relative mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <MenuItem
            key={`${title}-${index}`}
            name={item.name}
            description={item.description}
            price={item.price}
            category={title}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default MenuCategory;
