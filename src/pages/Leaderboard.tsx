
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Contributor {
  id: string;
  name: string;
  phone: string;
  total_reports: number;
  completed_reports: number;
  success_rate: number;
  badge: string;
  join_date: string;
}

const Leaderboard = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompletedReports: 0,
    totalActiveContributors: 0,
    averageSuccessRate: 0
  });

  useEffect(() => {
    fetchContributors();
    fetchStats();
  }, []);

  const fetchContributors = async () => {
    try {
      const { data, error } = await supabase
        .from('contributors')
        .select('*')
        .order('completed_reports', { ascending: false });

      if (error) {
        console.error('Error fetching contributors:', error);
        return;
      }

      setContributors(data || []);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: contributorsData, error: contributorsError } = await supabase
        .from('contributors')
        .select('completed_reports, success_rate');

      if (contributorsError) {
        console.error('Error fetching stats:', contributorsError);
        return;
      }

      const totalCompletedReports = contributorsData?.reduce((sum, c) => sum + c.completed_reports, 0) || 0;
      const totalActiveContributors = contributorsData?.length || 0;
      const averageSuccessRate = totalActiveContributors > 0 
        ? Math.round(contributorsData?.reduce((sum, c) => sum + (c.success_rate || 0), 0) / totalActiveContributors)
        : 0;

      setStats({
        totalCompletedReports,
        totalActiveContributors,
        averageSuccessRate
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 arabic-text">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalCompletedReports}</h3>
                <p className="text-gray-600 arabic-text">إجمالي البلاغات المُصلحة</p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalActiveContributors}</h3>
                <p className="text-gray-600 arabic-text">عدد المساهمين النشطين</p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.averageSuccessRate}%</h3>
                <p className="text-gray-600 arabic-text">معدل نجاح الإصلاحات</p>
              </CardContent>
            </Card>
          </div>

          {/* Top 3 Winners */}
          {contributors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {contributors.slice(0, 3).map((user, index) => (
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
                      <p className="text-2xl font-bold text-blue-600">{user.completed_reports}</p>
                      <p className="text-sm text-gray-600 arabic-text">بلاغ مُصلح</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600 arabic-text">
                        معدل النجاح: <span className="font-semibold text-green-600">{user.success_rate}%</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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
                {contributors.length > 0 ? (
                  contributors.map((user, index) => (
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
                          <p className="text-sm text-gray-600">انضم في {new Date(user.join_date).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{user.completed_reports}</p>
                          <p className="text-xs text-gray-600 arabic-text">مُصلح</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-700">{user.total_reports}</p>
                          <p className="text-xs text-gray-600 arabic-text">إجمالي</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-semibold text-green-600">{user.success_rate}%</p>
                          <p className="text-xs text-gray-600 arabic-text">نجاح</p>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(user.badge)}`}>
                          {user.badge}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 arabic-text">لا توجد مساهمات بعد</p>
                    <p className="text-sm text-gray-400 arabic-text mt-2">كن أول من يساهم في تحسين الطرق!</p>
                  </div>
                )}
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
