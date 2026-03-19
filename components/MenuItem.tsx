"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  category?: string;
  index?: number;
}

const MenuItem: FC<MenuItemProps> = ({
  name,
  description,
  price,
  category,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ translateY: -4 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-500/50 transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <span className="text-amber-400 font-bold text-lg">{price}</span>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      {category && (
        <span className="inline-block mt-4 px-3 py-1 text-xs font-medium text-amber-400 bg-amber-400/10 rounded-full">
          {category}
        </span>
      )}
    </motion.div>
  );
};

export default MenuItem;
