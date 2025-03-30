
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coffee, 
  Users, 
  Settings, 
  ShoppingBag, 
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    products: false,
    orders: false
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const mainNavLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true }
  ];

  const submenus = [
    { 
      name: 'Products', 
      key: 'products',
      icon: <Coffee className="w-5 h-5" />,
      children: [
        { name: 'All Products', path: '/admin/products' },
        { name: 'Add New', path: '/admin/products/new' }
      ]
    },
    { 
      name: 'Orders', 
      key: 'orders',
      icon: <ShoppingBag className="w-5 h-5" />,
      children: [
        { name: 'All Orders', path: '/admin/orders' }
      ]
    }
  ];

  const otherNavLinks = [
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {mainNavLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.exact}
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
          
          {/* Submenu sections */}
          {submenus.map((submenu) => (
            <li key={submenu.key} className="space-y-1">
              <button
                onClick={() => toggleSubmenu(submenu.key)}
                className="flex items-center justify-between w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="flex items-center">
                  {submenu.icon}
                  <span className="ml-3">{submenu.name}</span>
                </div>
                {openSubmenus[submenu.key] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {openSubmenus[submenu.key] && (
                <ul className="pl-10 space-y-1">
                  {submenu.children.map((child) => (
                    <li key={child.path}>
                      <NavLink
                        to={child.path}
                        className={({ isActive }) => 
                          `block py-2 px-3 rounded-md ${
                            isActive 
                              ? 'bg-gray-700 text-white' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`
                        }
                      >
                        {child.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          
          {otherNavLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
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

export default AdminSidebar;
