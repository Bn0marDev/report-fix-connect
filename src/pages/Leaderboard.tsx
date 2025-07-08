
import React from 'react';
import { Trophy, Medal, Award, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data for leaderboard
const leaderboardData = [
  {
    id: 1,
    name: 'أحمد محمد العلي',
    completedReports: 48,
    totalReports: 52,
    successRate: 92,
    badge: 'ذهبي',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'فاطمة سعد الخالد',
    completedReports: 41,
    totalReports: 45,
    successRate: 91,
    badge: 'فضي',
    joinDate: '2024-02-03'
  },
  {
    id: 3,
    name: 'محمد عبدالله النصر',
    completedReports: 35,
    totalReports: 40,
    successRate: 88,
    badge: 'برونزي',
    joinDate: '2024-01-28'
  },
  {
    id: 4,
    name: 'نورا أحمد الزهراني',
    completedReports: 32,
    totalReports: 36,
    successRate: 89,
    badge: 'متقدم',
    joinDate: '2024-03-10'
  },
  {
    id: 5,
    name: 'سعد عبدالرحمن المطيري',
    completedReports: 28,
    totalReports: 33,
    successRate: 85,
    badge: 'متقدم',
    joinDate: '2024-02-20'
  },
  {
    id: 6,
    name: 'مريم خالد العتيبي',
    completedReports: 25,
    totalReports: 29,
    successRate: 86,
    badge: 'مبتدئ',
    joinDate: '2024-03-15'
  }
];

const Leaderboard = () => {
  const getBadgeIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'ذهبي': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'فضي': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'برونزي': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'متقدم': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPositionStyle = (position: number) => {
    if (position <= 3) {
      return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200';
    }
    return 'bg-white border border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowRight className="h-5 w-5" />
              <span className="arabic-text">العودة للرئيسية</span>
            </Link>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="arabic-text">
                <h1 className="text-xl font-bold text-gray-900">لوحة المتصدرين</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center arabic-text mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              أبطال تحسين الطرق
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              تقدير وشكر للمواطنين المتميزين الذين ساهموا في تحسين البنية التحتية للطرق
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="card-hover text-center">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">156</h3>
                <p className="text-gray-600 arabic-text">إجمالي البلاغات المُصلحة</p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">24</h3>
                <p className="text-gray-600 arabic-text">عدد المساهمين النشطين</p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">89%</h3>
                <p className="text-gray-600 arabic-text">معدل نجاح الإصلاحات</p>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Winners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {leaderboardData.slice(0, 3).map((user, index) => (
              <Card key={user.id} className={`card-hover ${getPositionStyle(index + 1)}`}>
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    {getBadgeIcon(index + 1)}
                  </div>
                  <CardTitle className="arabic-text text-lg">{user.name}</CardTitle>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(user.badge)}`}>
                    {user.badge}
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-blue-600">{user.completedReports}</p>
                    <p className="text-sm text-gray-600 arabic-text">بلاغ مُصلح</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 arabic-text">
                      معدل النجاح: <span className="font-semibold text-green-600">{user.successRate}%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="arabic-text">جدول المتصدرين الكامل</CardTitle>
              <CardDescription className="arabic-text">
                ترتيب جميع المساهمين حسب عدد البلاغات المُصلحة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((user, index) => (
                  <div 
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${getPositionStyle(index + 1)} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        <span className="font-bold text-gray-600">#{index + 1}</span>
                      </div>
                      
                      <div className="arabic-text">
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">انضم في {user.joinDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{user.completedReports}</p>
                        <p className="text-xs text-gray-600 arabic-text">مُصلح</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">{user.totalReports}</p>
                        <p className="text-xs text-gray-600 arabic-text">إجمالي</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-600">{user.successRate}%</p>
                        <p className="text-xs text-gray-600 arabic-text">نجاح</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(user.badge)}`}>
                        {user.badge}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="outline" className="arabic-text">
                  عرض المزيد من المساهمين
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="mt-12 bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4 arabic-text">هل تريد الانضمام للمتصدرين؟</h3>
              <p className="text-lg mb-6 arabic-text">ابدأ بالإبلاغ عن أعطال الطرق وساهم في تحسين مجتمعك</p>
              <Link to="/report">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  ابدأ الآن
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
