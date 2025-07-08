
import React, { useState, useEffect } from 'react';
import { BarChart3, ArrowRight, Search, Filter, Eye, Edit, CheckCircle, Clock, AlertTriangle, MapPin, Calendar, Phone, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data for admin dashboard
const mockReports = [
  {
    id: 1,
    reporterName: 'أحمد محمد العلي',
    reporterPhone: '0501234567',
    type: 'حفرة في الطريق',
    description: 'حفرة كبيرة في شارع الملك فهد تسبب خطراً على السيارات',
    streetDescription: 'شارع الملك فهد، بجانب مسجد النور، بعد إشارة المرور الأولى',
    status: 'pending',
    priority: 'high',
    location: { lat: 24.7136, lng: 46.6753 },
    images: ['image1.jpg', 'image2.jpg'],
    date: '2024-07-08',
    time: '14:30',
    assignedTo: null,
    notes: ''
  },
  {
    id: 2,
    reporterName: 'فاطمة سعد الخالد',
    reporterPhone: '0507654321',
    type: 'إضاءة معطلة',
    description: 'عمود الإضاءة لا يعمل منذ أسبوع',
    streetDescription: 'طريق الأمير محمد بن عبدالعزيز، أمام مجمع الظهران التجاري',
    status: 'in-progress',
    priority: 'medium',
    location: { lat: 24.7186, lng: 46.6803 },
    images: ['image3.jpg'],
    date: '2024-07-07',
    time: '20:15',
    assignedTo: 'فريق الصيانة الأول',
    notes: 'تم تحديد موعد الإصلاح ليوم الخميس'
  },
  {
    id: 3,
    reporterName: 'محمد عبدالله النصر',
    reporterPhone: '0551122334',
    type: 'رصيف مكسور',
    description: 'كسر في الرصيف يعيق مرور المشاة وخاصة ذوي الاحتياجات الخاصة',
    streetDescription: 'شارع العليا الرئيسي، بجانب بنك الراجحي',
    status: 'completed',
    priority: 'low',
    location: { lat: 24.7086, lng: 46.6703 },
    images: [],
    date: '2024-07-06',
    time: '16:45',
    assignedTo: 'فريق البنية التحتية',
    notes: 'تم الإصلاح بنجاح وإعادة تأهيل الرصيف'
  }
];

const Admin = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState(mockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Mock authentication - في التطبيق الحقيقي يجب استخدام نظام مصادقة آمن
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (reportId: number, newStatus: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ));
    toast({
      title: "تم تحديث حالة البلاغ",
      description: "تم تغيير حالة البلاغ بنجاح",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'in-progress': return 'قيد الإصلاح';
      case 'completed': return 'تم الإصلاح';
      default: return 'غير محدد';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'غير محدد';
    }
  };

  // Filter reports based on search and filters
  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.reporterName.includes(searchTerm) ||
        report.type.includes(searchTerm) ||
        report.description.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, priorityFilter]);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="arabic-text text-2xl">لوحة تحكم المسؤولين</CardTitle>
            <CardDescription className="arabic-text">
              يرجى تسجيل الدخول للمتابعة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium arabic-text">اسم المستخدم</label>
                <Input
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium arabic-text">كلمة المرور</label>
                <Input
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-primary">
                تسجيل الدخول
              </Button>
            </form>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700 arabic-text">
                للتجربة: اسم المستخدم: admin، كلمة المرور: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    completed: reports.filter(r => r.status === 'completed').length
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
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="arabic-text">
                  <h1 className="text-xl font-bold text-gray-900">لوحة تحكم المسؤولين</h1>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setIsAuthenticated(false)}
                className="arabic-text"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 arabic-text">إجمالي البلاغات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 arabic-text">قيد المراجعة</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 arabic-text">قيد الإصلاح</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 arabic-text">تم الإصلاح</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="arabic-text">البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في البلاغات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 arabic-text"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="arabic-text">
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="arabic-text">جميع الحالات</SelectItem>
                  <SelectItem value="pending" className="arabic-text">قيد المراجعة</SelectItem>
                  <SelectItem value="in-progress" className="arabic-text">قيد الإصلاح</SelectItem>
                  <SelectItem value="completed" className="arabic-text">تم الإصلاح</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="arabic-text">
                  <SelectValue placeholder="تصفية حسب الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="arabic-text">جميع الأولويات</SelectItem>
                  <SelectItem value="high" className="arabic-text">عالية</SelectItem>
                  <SelectItem value="medium" className="arabic-text">متوسطة</SelectItem>
                  <SelectItem value="low" className="arabic-text">منخفضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="arabic-text">جدول البلاغات</CardTitle>
            <CardDescription className="arabic-text">
              إدارة ومتابعة جميع البلاغات الواردة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        #{report.id}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 arabic-text">{report.type}</h4>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span className="arabic-text">{report.reporterName}</span>
                          <Phone className="h-4 w-4" />
                          <span>{report.reporterPhone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                      <Badge className={getPriorityColor(report.priority)}>
                        {getPriorityText(report.priority)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 arabic-text mb-1">وصف المشكلة:</p>
                      <p className="text-sm text-gray-900 arabic-text">{report.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 arabic-text mb-1">وصف الموقع:</p>
                      <p className="text-sm text-gray-900 arabic-text">{report.streetDescription}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4" />
                        <span>{report.date} - {report.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <MapPin className="h-4 w-4" />
                        <span>خريطة</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Select
                        value={report.status}
                        onValueChange={(value) => handleStatusChange(report.id, value)}
                      >
                        <SelectTrigger className="w-32 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending" className="arabic-text">قيد المراجعة</SelectItem>
                          <SelectItem value="in-progress" className="arabic-text">قيد الإصلاح</SelectItem>
                          <SelectItem value="completed" className="arabic-text">تم الإصلاح</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="arabic-text">تفاصيل البلاغ #{report.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600 arabic-text">اسم المبلغ</p>
                                <p className="text-sm text-gray-900 arabic-text">{report.reporterName}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600 arabic-text">رقم الهاتف</p>
                                <p className="text-sm text-gray-900">{report.reporterPhone}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-600 arabic-text">نوع البلاغ</p>
                              <p className="text-sm text-gray-900 arabic-text">{report.type}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-600 arabic-text">وصف المشكلة</p>
                              <p className="text-sm text-gray-900 arabic-text">{report.description}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-600 arabic-text">وصف الموقع</p>
                              <p className="text-sm text-gray-900 arabic-text">{report.streetDescription}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600 arabic-text">التاريخ والوقت</p>
                                <p className="text-sm text-gray-900">{report.date} - {report.time}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600 arabic-text">الحالة</p>
                                <Badge className={getStatusColor(report.status)}>
                                  {getStatusText(report.status)}
                                </Badge>
                              </div>
                            </div>
                            
                            {report.assignedTo && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 arabic-text">مُكلف إلى</p>
                                <p className="text-sm text-gray-900 arabic-text">{report.assignedTo}</p>
                              </div>
                            )}
                            
                            {report.notes && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 arabic-text">ملاحظات</p>
                                <p className="text-sm text-gray-900 arabic-text">{report.notes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 arabic-text">لا توجد بلاغات تطابق معايير البحث</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
