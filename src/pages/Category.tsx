
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MenuItemCard from '@/components/MenuItemCard';
import CartButton from '@/components/CartButton';
import BottomNavigation from '@/components/BottomNavigation';
import { MenuItem } from '@/types';
import { productApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

// Define categories for navigation
const categoryMap = {
  'food': { id: 'food', name: 'وجبات سريعة', type: 'food' },
  'juice': { id: 'juice', name: 'مشروبات ومرطبات', type: 'juice' }
};

const Category = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const category = id ? categoryMap[id as keyof typeof categoryMap] : undefined;
  
  useEffect(() => {
    const loadProducts = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all products and filter by category
        const products = await productApi.getAllProducts();
        setItems(products.filter(item => item.category === id));
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [id, toast]);
  
  if (!category) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Category not found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">{category.name}</h1>
          </div>
          <CartButton />
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-16">
            <p>Loading products...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-lg font-semibold mb-2">No items found</h2>
            <p className="text-gray-500 mb-6">This category is currently empty</p>
            <Button 
              className="bg-brand-500 hover:bg-brand-600"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Category;
