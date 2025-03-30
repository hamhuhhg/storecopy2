import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Order } from '@/types';
import { Clock } from 'lucide-react';
import { orderApi } from '@/services/api';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const fetchedOrders = await orderApi.getAllOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
    
    // Set up a refresh interval
    const intervalId = setInterval(loadOrders, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
    
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      
      // Reload orders after update
      const updatedOrders = await orderApi.getAllOrders();
      setOrders(updatedOrders);
      
      toast({
        title: "Order updated",
        description: `Order #${orderId.slice(-4)} status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const statusBadgeColors: Record<Order['status'], string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-purple-100 text-purple-800',
    'ready': 'bg-green-100 text-green-800',
    'delivered': 'bg-gray-100 text-gray-800',
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Manage and process customer orders
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            Auto-refresh: <strong>30s</strong>
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Order #{order.id.slice(-4)}</CardTitle>
                  <Badge className={statusBadgeColors[order.status]}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="font-medium">{order.customerName}</p>
                    {order.contactNumber && (
                      <p className="text-sm">{order.contactNumber}</p>
                    )}
                    {order.deliveryAddress && (
                      <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Items</h3>
                    <ul className="mt-1 space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-sm">
                          {item.quantity}x {item.name} - ${item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-dashed flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {order.status !== 'confirmed' && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          className="text-blue-500 border-blue-500"
                        >
                          Confirm
                        </Button>
                      )}
                      
                      {(order.status === 'confirmed') && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, 'preparing')}
                          className="text-purple-500 border-purple-500"
                        >
                          Preparing
                        </Button>
                      )}
                      
                      {(order.status === 'preparing') && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, 'ready')}
                          className="text-green-500 border-green-500"
                        >
                          Ready
                        </Button>
                      )}
                      
                      {(order.status === 'ready') && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="text-gray-500 border-gray-500"
                        >
                          Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
