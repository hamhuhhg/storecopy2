
import React from 'react';
import { useCart } from '@/store/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CartButton: React.FC = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="relative bg-white border-gray-200 rounded-full"
      onClick={() => navigate('/cart')}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-cart-bounce">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
