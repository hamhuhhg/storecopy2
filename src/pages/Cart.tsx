
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { toast } from "sonner";
import BottomNavigation from '@/components/BottomNavigation';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    navigate('/checkout');
  };
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Your Cart</h1>
          
          {cartItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-red-500"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious items to your cart</p>
            <Button 
              className="bg-brand-500 hover:bg-brand-600"
              onClick={() => navigate('/')}
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.menuItem.id} 
                  className="flex items-center border-b pb-4"
                >
                  <div 
                    className="w-20 h-20 rounded-lg overflow-hidden mr-3 flex-shrink-0"
                    onClick={() => navigate(`/item/${item.menuItem.id}`)}
                  >
                    <img
                      src={item.menuItem.image || '/placeholder.svg'}
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.menuItem.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.menuItem.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Order Summary</h3>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>$2.00</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(totalPrice + 2 + totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4 bg-brand-500 hover:bg-brand-600"
              size="lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Cart;
