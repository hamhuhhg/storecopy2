
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Package, RefreshCcw, Users } from 'lucide-react';

const AdminOverview = () => {
  // Mock data (in a real app, would come from an API)
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      icon: <CreditCard className="h-6 w-6" />,
      change: '+20.1%',
      trend: 'up',
    },
    {
      title: 'Orders',
      value: '356',
      icon: <Package className="h-6 w-6" />,
      change: '+12.2%',
      trend: 'up',
    },
    {
      title: 'Active Users',
      value: '2,103',
      icon: <Users className="h-6 w-6" />,
      change: '+5.4%',
      trend: 'up',
    },
    {
      title: 'Refunds',
      value: '$670.00',
      icon: <RefreshCcw className="h-6 w-6" />,
      change: '-3.2%',
      trend: 'down',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your restaurant's performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="text-gray-500">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We'll add charts and tables here in a future update
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We'll add a summary of popular items here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
