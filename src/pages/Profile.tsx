
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings, LogOut, CreditCard, 
  MapPin, Bell, HelpCircle, Moon 
} from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/store/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { icon: Settings, label: 'إعدادات الحساب' },
    { icon: CreditCard, label: 'طرق الدفع' },
    { icon: MapPin, label: 'العناوين المحفوظة' },
    { icon: Bell, label: 'الإشعارات' },
    { icon: HelpCircle, label: 'المساعدة والدعم' },
    { icon: Moon, label: 'الوضع الليلي' },
    { 
      icon: LogOut, 
      label: 'تسجيل الخروج', 
      danger: true,
      onClick: logout 
    },
  ];
  
  const name = user ? user.name : 'زائر';
  const email = user ? user.email : 'guest@example.com';
  const initial = name.charAt(0);
  
  return (
    <div className="pb-20" dir="rtl">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="p-4">
          <h1 className="text-xl font-bold">الملف الشخصي</h1>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center p-4 mb-6 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center ml-4">
            <span className="text-2xl font-bold text-brand-600">{initial}</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{name}</h2>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start text-right h-14 ${
                  item.danger ? 'text-red-500 hover:text-red-600' : ''
                }`}
                onClick={item.onClick}
              >
                <Icon className="h-5 w-5 ml-3" />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>إصدار التطبيق 1.0.0</p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
