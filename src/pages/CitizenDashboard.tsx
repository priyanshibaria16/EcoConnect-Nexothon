import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Gift, 
  Trophy, 
  Recycle, 
  MapPin,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Plus
} from 'lucide-react';
import { mockPickups, badges } from '@/data/mockData';

const CitizenDashboard = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  // Filter pickups for current user
  const userPickups = mockPickups.filter(pickup => pickup.userId === user.id);
  const completedPickups = userPickups.filter(pickup => pickup.status === 'completed');
  const pendingPickups = userPickups.filter(pickup => pickup.status === 'pending' || pickup.status === 'accepted');

  const stats = [
    {
      title: 'GreenCoins',
      value: user.greenCoins || 0,
      change: '+25 this week',
      icon: Gift,
      color: 'text-success',
    },
    {
      title: 'Eco Score',
      value: user.ecoScore || 0,
      change: '+12 this month',
      icon: Trophy,
      color: 'text-warning',
    },
    {
      title: 'Completed Pickups',
      value: completedPickups.length,
      change: 'This month: 3',
      icon: CheckCircle,
      color: 'text-primary',
    },
    {
      title: 'Impact Level',
      value: 'Eco Warrior',
      change: 'Next: Green Champion',
      icon: Star,
      color: 'text-purple-600',
    },
  ];

  const quickActions = [
    {
      title: 'Book New Pickup',
      description: 'Schedule waste collection',
      icon: Plus,
      to: '/citizen/book-pickup',
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: 'View Rewards',
      description: 'Redeem GreenCoins',
      icon: Gift,
      to: '/citizen/rewards',
      color: 'bg-success text-success-foreground',
    },
    {
      title: 'Track Score',
      description: 'Monitor eco progress',
      icon: TrendingUp,
      to: '/citizen/eco-score',
      color: 'bg-warning text-white',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Your recycling journey continues. Let's make today count!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-success">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      asChild
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center text-center space-y-2"
                    >
                      <Link to={action.to}>
                        <div className={`p-2 rounded-full ${action.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Pickups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Pickups
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/citizen/pickups">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPickups.slice(0, 3).map((pickup) => (
                  <div key={pickup.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Recycle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium capitalize">{pickup.wasteType}</p>
                        <Badge 
                          variant={pickup.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {pickup.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {pickup.address.split(',')[0]}
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        {new Date(pickup.preferredTime).toLocaleDateString()}
                      </div>
                    </div>
                    {pickup.greenCoinsEarned && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-success">
                          +{pickup.greenCoinsEarned} GC
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {userPickups.length === 0 && (
                  <div className="text-center py-8">
                    <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No pickups yet</p>
                    <Button asChild>
                      <Link to="/citizen/book-pickup">Book Your First Pickup</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Eco Score Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-warning" />
                <span>Eco Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current Score</span>
                    <span className="font-medium">{user.ecoScore}/100</span>
                  </div>
                  <Progress value={user.ecoScore} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {100 - (user.ecoScore || 0)} points to next level
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Recent Achievements</p>
                  <div className="space-y-2">
                    {badges.filter(badge => badge.earned).slice(0, 2).map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-2">
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-sm font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Pickups */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPickups.length > 0 ? (
                <div className="space-y-3">
                  {pendingPickups.map((pickup) => (
                    <div key={pickup.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{pickup.wasteType}</span>
                        <Badge variant="secondary">{pickup.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(pickup.preferredTime).toLocaleDateString()}
                        </div>
                        {pickup.collectorName && (
                          <div className="mt-1">
                            Collector: {pickup.collectorName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No pending pickups</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;