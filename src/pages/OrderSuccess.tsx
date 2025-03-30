
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface LocationState {
  orderId?: string;
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = (location.state as LocationState) || {};
  
  return (
    <div className="pb-20">
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="mb-6">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        
        {orderId && (
          <p className="text-gray-500 mb-8">
            Your order number is <span className="font-bold">{orderId}</span>
          </p>
        )}
        
        <p className="text-gray-600 mb-8">
          Thank you for your order! You will receive a confirmation on your phone soon.
          We're preparing your food and it will be ready for you shortly.
        </p>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-brand-500 hover:bg-brand-600"
            onClick={() => navigate('/orders')}
          >
            Track Your Order
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default OrderSuccess;
