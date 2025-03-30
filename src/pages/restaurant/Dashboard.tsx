
import React from 'react';
import { useAuth } from '@/store/AuthContext';
import { Outlet } from 'react-router-dom';
import RestaurantSidebar from '@/components/restaurant/RestaurantSidebar';
import RestaurantHeader from '@/components/restaurant/RestaurantHeader';

const RestaurantDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <RestaurantSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <RestaurantHeader user={user} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
