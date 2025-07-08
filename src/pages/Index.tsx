
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Users, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import MapView from '@/components/MapView';
import RecentReports from '@/components/RecentReports';

const Index = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    completedReports: 0
  });

  // Mock data for demonstration - في التطبيق الحقيقي سيتم جلب البيانات من قاعدة البيانات
  useEffect(() => {
    setStats({
      totalReports: 156,
      pendingReports: 23,
      inProgressReports: 45,
      completedReports: 88
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="arabic-text">
                <h1 className="text-2xl font-bold text-gray-900">منصة الإبلاغ عن أعطال الطرق</h1>
                <p className="text-gray-600">تحسين البنية التحتية من خلال مشاركة المجتمع</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link to="/report">
                <Button className="btn-primary flex items-center space-x-2 rtl:space-x-reverse">
                  <Plus className="h-5 w-5" />
                  <span>إبلاغ جديد</span>
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="h-5 w-5" />
                  <span>المتصدرون</span>
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" className="flex items-center space-x-2 rtl:space-x-reverse">
                  <BarChart3 className="h-5 w-5" />
                  <span>لوحة التحكم</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center arabic-text mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            معاً نحو طرق أفضل وأكثر أماناً
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ساهم في تحسين البنية التحتية للطرق من خلال الإبلاغ عن الأعطال والمشاكل. 
            كل بلاغ يساعد في جعل طرقنا أكثر أماناً للجميع.
          </p>
          <Link to="/report">
            <Button size="lg" className="btn-primary text-lg px-8 py-4">
              ابدأ بالإبلاغ الآن
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium arabic-text">إجمالي البلاغات</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground arabic-text">منذ بداية المشروع</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium arabic-text">قيد المراجعة</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground arabic-text">في انتظار المراجعة</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium arabic-text">قيد الإصلاح</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgressReports}</div>
              <p className="text-xs text-muted-foreground arabic-text">يتم العمل عليها</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium arabic-text">تم الإصلاح</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedReports}</div>
              <p className="text-xs text-muted-foreground arabic-text">تم إنجازها بنجاح</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="arabic-text">خريطة البلاغات</CardTitle>
                <CardDescription className="arabic-text">
                  اعرض جميع البلاغات على الخريطة وتفاعل معها
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <MapView />
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="arabic-text">البلاغات الحديثة</CardTitle>
                <CardDescription className="arabic-text">
                  آخر البلاغات المرسلة للمنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentReports />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="mt-16">
          <div className="text-center arabic-text mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">كيف تعمل المنصة؟</h3>
            <p className="text-lg text-gray-600">خطوات بسيطة للمساهمة في تحسين الطرق</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover text-center p-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 arabic-text">حدد الموقع</h4>
              <p className="text-gray-600 arabic-text">استخدم الخريطة أو GPS لتحديد موقع المشكلة بدقة</p>
            </Card>

            <Card className="card-hover text-center p-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 arabic-text">أرسل البلاغ</h4>
              <p className="text-gray-600 arabic-text">اكتب وصفاً للمشكلة وأرفق الصور إن أمكن</p>
            </Card>

            <Card className="card-hover text-center p-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2 arabic-text">تابع التقدم</h4>
              <p className="text-gray-600 arabic-text">راقب حالة بلاغك من المراجعة إلى الإصلاح</p>
            </Card>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center arabic-text">
            <p className="text-gray-400">
              © 2024 منصة الإبلاغ عن أعطال الطرق. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-500 mt-2">
              تم تطويرها بواسطة Lovable.dev
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
