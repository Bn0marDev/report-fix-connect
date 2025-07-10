import React from 'react';
import { MapPin, Plus, Users, BarChart3, Award, ArrowLeft, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import RecentReports from '@/components/RecentReports';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 arabic-text">مدينتي</h1>
                <p className="text-sm text-gray-600 arabic-text">نحو مدينة أفضل</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              <Link to="/leaderboard" className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-600 transition-colors">
                <Award className="h-4 w-4" />
                <span className="arabic-text">لوحة الشرف</span>
              </Link>
              <Link to="/admin" className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-600 transition-colors">
                <BarChart3 className="h-4 w-4" />
                <span className="arabic-text">لوحة التحكم</span>
              </Link>
              <Link to="/developers" className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-600 transition-colors">
                <Code2 className="h-4 w-4" />
                <span className="arabic-text">فريق التطوير</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 arabic-text">
            ساهم في تطوير مدينتك
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 arabic-text leading-relaxed">
            بلّغ عن المشاكل البلدية واتبع حالة البلاغات لجعل مدينتنا مكاناً أفضل للعيش
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/report">
              <Button size="lg" className="btn-primary w-full sm:w-auto">
                <Plus className="ml-2 h-5 w-5" />
                تقديم بلاغ جديد
              </Button>
            </Link>
            
            <Link to="/admin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <BarChart3 className="ml-2 h-5 w-5" />
                عرض الإحصائيات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Card className="card-hover text-center">
            <CardHeader>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="arabic-text">تحديد الموقع بدقة</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="arabic-text">
                حدد موقع المشكلة بدقة على الخريطة لتسهيل عملية الإصلاح
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover text-center">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="arabic-text">مشاركة المجتمع</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="arabic-text">
                شارك مع أفراد المجتمع في تحسين المدينة وحل المشاكل
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover text-center">
            <CardHeader>
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="arabic-text">متابعة مستمرة</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="arabic-text">
                تابع حالة بلاغك من التقديم حتى الإنجاز مع تحديثات مستمرة
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="arabic-text">البلاغات الحديثة</CardTitle>
                  <CardDescription className="arabic-text">
                    آخر البلاغات المقدمة من المواطنين
                  </CardDescription>
                </div>
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="arabic-text">
                    عرض الكل
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <RecentReports />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
              <CardHeader>
                <CardTitle className="arabic-text">إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="arabic-text">البلاغات المكتملة</span>
                  <span className="font-bold text-xl">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="arabic-text">قيد المعالجة</span>
                  <span className="font-bold text-xl">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="arabic-text">المساهمون النشطون</span>
                  <span className="font-bold text-xl">45</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="arabic-text">نصائح مفيدة</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 arabic-text">
                  <li>• أضف صوراً واضحة للمشكلة</li>
                  <li>• حدد الموقع بدقة على الخريطة</li>
                  <li>• اكتب وصفاً مفصلاً للمشكلة</li>
                  <li>• تابع حالة بلاغك بانتظام</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold arabic-text">مدينتي</h3>
              </div>
              <p className="text-gray-400 arabic-text text-sm">
                منصة لتقديم البلاغات البلدية ومتابعة حالتها
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 arabic-text">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/report" className="text-gray-400 hover:text-white transition-colors arabic-text">تقديم بلاغ</Link></li>
                <li><Link to="/admin" className="text-gray-400 hover:text-white transition-colors arabic-text">لوحة التحكم</Link></li>
                <li><Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors arabic-text">لوحة الشرف</Link></li>
                <li><Link to="/developers" className="text-gray-400 hover:text-white transition-colors arabic-text">فريق التطوير</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm arabic-text">
              © 2024 مدينتي
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
