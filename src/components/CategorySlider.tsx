
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '@/services/api';
import { MenuItem } from '@/types';

interface CategorySliderProps {
  filter?: 'food' | 'juice';
}

const categories = {
  'food': { id: 'food', name: 'وجبات سريعة', image: '/images/food-category.jpg' },
  'juice': { id: 'juice', name: 'مشروبات ومرطبات', image: '/images/juice-category.jpg' }
};

const CategorySlider: React.FC<CategorySliderProps> = ({ filter }) => {
  const navigate = useNavigate();
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Fetch products and extract categories
        const products = await productApi.getAllProducts();
        // Ensure we're explicitly casting categories to string array
        const uniqueCategories = Array.from(
          new Set(products.map((p: MenuItem) => p.category as string))
        );
        setActiveCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Error loading categories:', error);
        setActiveCategories(Object.keys(categories));
      }
    };
    
    loadCategories();
  }, []);
  
  // Filter categories based on the filter prop
  const filteredCategories = Object.entries(categories)
    .filter(([key]) => !filter || key === filter)
    .filter(([key]) => activeCategories.includes(key))
    .map(([key, value]) => value);

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 px-4 pb-2" dir="ltr">
        {filteredCategories.map(category => (
          <div
            key={category.id}
            className="flex-shrink-0 w-28 cursor-pointer"
            onClick={() => navigate(`/category/${category.id}`)}
          >
            <div className="h-24 rounded-xl overflow-hidden bg-gray-200 mb-1">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-700">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
