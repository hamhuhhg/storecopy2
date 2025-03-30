
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MenuItem } from '@/types';
import { useCart } from '@/store/CartContext';
import { useNavigate } from 'react-router-dom';

interface MenuItemCardProps {
  item: MenuItem;
  compact?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, compact = false }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
  };

  const handleClick = () => {
    navigate(`/item/${item.id}`);
  };

  return (
    <div 
      className={`menu-card cursor-pointer ${compact ? 'h-48' : 'h-64'}`}
      onClick={handleClick}
    >
      <div className="relative h-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
        <img 
          src={item.image || '/placeholder.svg'} 
          alt={item.name}
          className={`w-full h-full ${item.category === 'food' ? 'food-image' : 'juice-image'}`}
        />
        {item.popular && (
          <span className="absolute top-2 left-2 bg-brand-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-20">
            Popular
          </span>
        )}
      </div>
      
      <div className="p-3 flex flex-col h-1/2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-base leading-tight">{item.name}</h3>
          <span className="font-semibold text-brand-500">${item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-auto line-clamp-2">
          {item.description}
        </p>
        
        <Button 
          size="sm" 
          onClick={handleAddToCart}
          className={`mt-1 ${item.category === 'juice' ? 'bg-juice-500 hover:bg-juice-600' : 'bg-brand-500 hover:bg-brand-600'}`}
        >
          <Plus className="h-4 w-4 mr-1" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default MenuItemCard;
