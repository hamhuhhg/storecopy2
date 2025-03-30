
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Package } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/store/AuthContext';
import { Order } from '@/types';
import db from '@/services/database';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          // Get orders for the current user
          const userOrders = await db.getOrdersByCustomerId(user.id);
          setOrders(userOrders);
        } catch (error) {
          console.error('فشل في تحميل الطلبات:', error);
          toast.error('حدث خطأ أثناء تحميل طلباتك. الرجاء المحاولة مرة أخرى.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);
  
  const hasActiveOrders = orders.some(order => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  );

  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
  );

  const pastOrders = orders.filter(order => order.status === 'delivered');

  const statusBadgeColors: Record<Order['status'], string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-purple-100 text-purple-800',
    'ready': 'bg-green-100 text-green-800',
    'delivered': 'bg-gray-100 text-gray-800',
  };

  const getStatusText = (status: Order['status']) => {
    const statusTexts = {
      'pending': 'قيد الانتظار',
      'confirmed': 'تم التأكيد',
      'preparing': 'جاري التحضير',
      'ready': 'جاهز للاستلام',
      'delivered': 'تم التوصيل'
    };
    return statusTexts[status];
  };
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="p-4">
          <h1 className="text-xl font-bold">طلباتي</h1>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-10">
            <p>جاري تحميل الطلبات...</p>
          </div>
        ) : hasActiveOrders ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">الطلبات النشطة</h2>
            {activeOrders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">طلب #{order.id.toString().slice(-4)}</CardTitle>
                    <Badge className={statusBadgeColors[order.status]}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <ul className="space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-sm">
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-dashed flex justify-between">
                        <span className="font-medium">الإجمالي:</span>
                        <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      وقت الطلب: {new Date(order.createdAt).toLocaleString('ar')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {pastOrders.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mt-6">سجل الطلبات</h2>
                {pastOrders.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 border-b py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">طلب #{order.id.toString().slice(-4)}</CardTitle>
                        <Badge className={statusBadgeColors[order.status]}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <ul className="space-y-1">
                            {order.items.map((item) => (
                              <li key={item.id} className="text-sm">
                                {item.quantity}x {item.name}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-2 pt-2 border-t border-dashed flex justify-between">
                            <span className="font-medium">الإجمالي:</span>
                            <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 ml-1" />
                          وقت الطلب: {new Date(order.createdAt).toLocaleString('ar')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">سجل الطلبات</h2>
            {orders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">طلب #{order.id.toString().slice(-4)}</CardTitle>
                    <Badge className={statusBadgeColors[order.status]}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <ul className="space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-sm">
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-dashed flex justify-between">
                        <span className="font-medium">الإجمالي:</span>
                        <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      وقت الطلب: {new Date(order.createdAt).toLocaleString('ar')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <Package className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">لا توجد طلبات</h2>
            <p className="text-gray-500 mb-6">ليس لديك أي طلبات في الوقت الحالي</p>
            <Button 
              className="bg-brand-500 hover:bg-brand-600"
              onClick={() => navigate('/')}
            >
              اطلب الآن
            </Button>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Orders;
