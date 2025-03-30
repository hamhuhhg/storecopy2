
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Coffee, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  ShoppingBag 
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';

const RestaurantSidebar = () => {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Orders', path: '/restaurant', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Menu Items', path: '/restaurant/menu', icon: <Coffee className="w-5 h-5" /> },
    { name: 'Settings', path: '/restaurant/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Restaurant Panel</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === '/restaurant'}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg ${
                    isActive 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {link.icon}
                <span className="ml-3">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center w-full p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default RestaurantSidebar;
