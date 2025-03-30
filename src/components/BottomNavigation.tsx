
import React from 'react';
import { Home, Search, ShoppingBag, User, ClipboardList, Users, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Common navigation items for all users
  const commonNavItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Search, label: 'البحث', path: '/search' },
  ];
  
  // Role-specific navigation items
  const getRoleSpecificNavItems = () => {
    if (!user) {
      return [{ icon: User, label: 'الملف', path: '/profile' }];
    }
    
    if (user.role === 'admin') {
      return [
        { icon: ShoppingBag, label: 'الطلبات', path: '/orders' },
        { icon: LayoutDashboard, label: 'الإدارة', path: '/admin' },
        { icon: User, label: 'الملف', path: '/profile' }
      ];
    } else if (user.role === 'restaurant') {
      return [
        { icon: ClipboardList, label: 'طلبات العملاء', path: '/restaurant' },
        { icon: User, label: 'الملف', path: '/profile' }
      ];
    } else {
      // Regular customer
      return [
        { icon: ShoppingBag, label: 'طلباتي', path: '/orders' },
        { icon: User, label: 'الملف', path: '/profile' }
      ];
    }
  };
  
  const navItems = [...commonNavItems, ...getRoleSpecificNavItems()];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 z-50">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <Link 
            to={item.path} 
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <div 
              className={`p-1 rounded-full transition-colors ${
                active ? 'text-brand-500' : 'text-gray-500'
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span className={`text-xs ${active ? 'text-brand-500 font-medium' : 'text-gray-500'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
