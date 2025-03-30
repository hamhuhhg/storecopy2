
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { toast } from "sonner";
import { useAuth } from '@/store/AuthContext';
import { orderApi } from '@/services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    note: ''
  });
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order data with all required fields from the Order type
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity
        })),
        totalAmount: totalPrice + 2 + totalPrice * 0.1,
        customerId: user?.id || 'guest',
        customerName: formData.name,
        contactNumber: formData.phone,
        deliveryAddress: formData.address,
        note: formData.note,
        // Add missing required properties
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };
      
      // Send order to API
      const newOrder = await orderApi.createOrder(orderData);
      
      console.log('طلب جديد:', newOrder);
      
      // Clear the cart
      clearCart();
      
      toast.success("تم تقديم الطلب بنجاح!");
      
      // Navigate to the order confirmation page
      navigate('/order-success', { state: { orderId: newOrder.id } });
      
    } catch (error) {
      console.error('خطأ في تقديم الطلب:', error);
      toast.error("حدث خطأ أثناء تقديم طلبك. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">إتمام الطلب</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">رقم الهاتف *</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="أدخل رقم هاتفك"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">عنوان التوصيل *</label>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="أدخل عنوانك الكامل"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ملاحظات الطلب</label>
            <Textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="أي تعليمات خاصة لطلبك؟"
              className="resize-none"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-bold mb-3">ملخص الطلب</h2>
          
          {cartItems.map((item) => (
            <div key={item.menuItem.id} className="flex justify-between py-2">
              <span>{item.quantity} × {item.menuItem.name}</span>
              <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="border-t mt-2 pt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">المجموع الفرعي</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">رسوم التوصيل</span>
              <span>$2.00</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">الضريبة</span>
              <span>${(totalPrice * 0.1).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between font-bold pt-1 border-t mt-1">
              <span>الإجمالي</span>
              <span>${(totalPrice + 2 + totalPrice * 0.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-brand-500 hover:bg-brand-600" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري المعالجة...' : 'تأكيد الطلب'}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
