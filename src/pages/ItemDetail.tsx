
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import CartButton from '@/components/CartButton';
import BottomNavigation from '@/components/BottomNavigation';
import { productApi } from '@/services/api';
import { MenuItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const product = await productApi.getProductById(id);
        setItem(product);
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id, toast]);
  
  const handleAddToCart = () => {
    if (item) {
      addToCart(item, quantity);
      navigate(-1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Loading product...</h2>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Item not found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/80 backdrop-blur-sm rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CartButton />
        </div>
        
        <div className="h-72 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          
          {item.popular && (
            <span className="absolute top-4 right-4 bg-brand-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
              Popular
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-t-3xl -mt-6 relative z-20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{item.name}</h1>
            <p className="text-gray-500 text-sm">
              {item.category === 'food' ? '🍔 Fast Food' : '🥤 Fresh Juice'}
            </p>
          </div>
          <span className="text-xl font-bold text-brand-500">${item.price.toFixed(2)}</span>
        </div>
        
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{item.description}</p>
        </div>
        
        <div className="mt-6">
          <h2 className="font-semibold mb-3">Quantity</h2>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-16 text-center text-xl font-semibold">{quantity}</span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="text-xl font-bold">${(item.price * quantity).toFixed(2)}</p>
          </div>
          
          <Button 
            size="lg"
            className={`px-8 ${item.category === 'juice' ? 'bg-juice-500 hover:bg-juice-600' : 'bg-brand-500 hover:bg-brand-600'}`}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ItemDetail;
