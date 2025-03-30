
import React from 'react';
import { User } from '@/types';
import { Bell } from 'lucide-react';

interface RestaurantHeaderProps {
  user: User | null;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ user }) => {
  return (
    <header className="bg-white shadow-sm py-3 px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-700 text-sm font-medium">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RestaurantHeader;
