import React, { useState, useEffect } from 'react';
import { BarChart3, ArrowRight, Search, Filter, Eye, Edit, CheckCircle, Clock, AlertTriangle, MapPin, Calendar, Phone, User, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import InteractiveMap from '@/components/InteractiveMap';

interface AdminReport {
  id: string;
  reporter_name: string;
  reporter_phone: string;
  type: string;
  custom_type?: string;
  description: string;
  street_description?: string;
  status: string;
  priority: string;
  location_lat?: number;
  location_lng?: number;
  images?: string[];
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MapReport {
  id: string;
  location_lat: number;
  location_lng: number;
  type: string;
  status: string;
  description: string;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<AdminReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, priorityFilter]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء جلب البلاغات",
          variant: "destructive",
        });
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.reporter_name.includes(searchTerm) ||
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
  };

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

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      setReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
      
      toast({
        title: "تم تحديث حالة البلاغ",
        description: "تم تغيير حالة البلاغ بنجاح",
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث حالة البلاغ",
        variant: "destructive",
      });
    }
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

  const toEnglishNumbers = (str: string) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = str;
    for (let i = 0; i < arabicNumbers.length; i++) {
      result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
    }
    return result;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      calendar: 'gregory'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const formattedDate = toEnglishNumbers(date.toLocaleDateString('en-US', dateOptions));
    const formattedTime = toEnglishNumbers(date.toLocaleTimeString('en-US', timeOptions));

    return {
      date: formattedDate,
      time: formattedTime
    };
  };

  const openInMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleMapReportClick = (report: MapReport) => {
    const adminReport = reports.find(r => r.id === report.id);
    if (adminReport) {
      setSelectedReport(adminReport);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="arabic-text text-xl sm:text-2xl">لوحة تحكم المسؤولين</CardTitle>
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

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    completed: reports.filter(r => r.status === 'completed').length
  };

  const mapReports: MapReport[] = reports
    .filter(r => r.location_lat && r.location_lng)
    .map(r => ({
      id: r.id,
      location_lat: r.location_lat!,
      location_lng: r.location_lng!,
      type: r.type,
      status: r.status,
      description: r.description,
      created_at: r.created_at
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowRight className="h-5 w-5" />
              <span className="arabic-text hidden sm:inline">العودة للرئيسية</span>
            </Link>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="arabic-text">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">لوحة تحكم المسؤولين</h1>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setIsAuthenticated(false)}
                className="arabic-text text-sm"
                size="sm"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="card-hover">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 arabic-text">إجمالي البلاغات</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 arabic-text">قيد المراجعة</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 arabic-text">قيد الإصلاح</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 arabic-text">تم الإصلاح</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports" className="arabic-text">البلاغات</TabsTrigger>
            <TabsTrigger value="map" className="arabic-text">الخريطة</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="arabic-text">البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="arabic-text">جدول البلاغات</CardTitle>
                <CardDescription className="arabic-text">
                  إدارة ومتابعة جميع البلاغات الواردة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                      const { date, time } = formatDate(report.created_at);
                      
                      return (
                        <div key={report.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0">
                              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                #{toEnglishNumbers(report.id.slice(-4))}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-gray-900 arabic-text text-sm sm:text-base truncate">{report.type}</h4>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm text-gray-600 mt-1">
                                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="arabic-text truncate">{report.reporter_name}</span>
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{toEnglishNumbers(report.reporter_phone)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse flex-shrink-0">
                              <Badge className={`${getStatusColor(report.status)} text-xs`}>
                                {getStatusText(report.status)}
                              </Badge>
                              <Badge className={`${getPriorityColor(report.priority)} text-xs hidden sm:inline-flex`}>
                                {getPriorityText(report.priority)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600 arabic-text mb-1">وصف المشكلة:</p>
                              <p className="text-xs sm:text-sm text-gray-900 arabic-text line-clamp-2">{report.description}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600 arabic-text mb-1">وصف الموقع:</p>
                              <p className="text-xs sm:text-sm text-gray-900 arabic-text line-clamp-2">{report.street_description || 'لم يتم تحديد'}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="whitespace-nowrap">{date} - {time}</span>
                              </div>
                              {report.location_lat && report.location_lng && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openInMaps(report.location_lat!, report.location_lng!)}
                                  className="flex items-center space-x-1 rtl:space-x-reverse text-xs p-1 h-auto text-blue-600 hover:text-blue-800"
                                >
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span>عرض في الخرائط</span>
                                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Select
                                value={report.status}
                                onValueChange={(value) => handleStatusChange(report.id, value)}
                              >
                                <SelectTrigger className="w-28 sm:w-32 text-xs sm:text-sm">
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
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="arabic-text">تفاصيل البلاغ #{toEnglishNumbers(report.id.slice(-8))}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-gray-600 arabic-text">اسم المبلغ</p>
                                        <p className="text-sm text-gray-900 arabic-text">{report.reporter_name}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-600 arabic-text">رقم الهاتف</p>
                                        <p className="text-sm text-gray-900">{toEnglishNumbers(report.reporter_phone)}</p>
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
                                    
                                    {report.street_description && (
                                      <div>
                                        <p className="text-sm font-medium text-gray-600 arabic-text">وصف الموقع</p>
                                        <p className="text-sm text-gray-900 arabic-text">{report.street_description}</p>
                                      </div>
                                    )}
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-gray-600 arabic-text">التاريخ والوقت</p>
                                        <p className="text-sm text-gray-900">{date} - {time}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-600 arabic-text">الحالة</p>
                                        <Badge className={getStatusColor(report.status)}>
                                          {getStatusText(report.status)}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    {report.location_lat && report.location_lng && (
                                      <div>
                                        <p className="text-sm font-medium text-gray-600 arabic-text mb-2">الموقع</p>
                                        <div className="flex items-center justify-between">
                                          <p className="text-sm text-gray-900">
                                            خط العرض: {toEnglishNumbers(report.location_lat.toString())} | خط الطول: {toEnglishNumbers(report.location_lng.toString())}
                                          </p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openInMaps(report.location_lat!, report.location_lng!)}
                                            className="flex items-center space-x-2 rtl:space-x-reverse"
                                          >
                                            <MapPin className="h-4 w-4" />
                                            <span>عرض في الخرائط</span>
                                            <ExternalLink className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 arabic-text">لا توجد بلاغات تطابق معايير البحث</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="arabic-text">خريطة البلاغات</CardTitle>
                <CardDescription className="arabic-text">
                  عرض جميع البلاغات على الخريطة حسب مواقعها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <InteractiveMap
                    reports={mapReports}
                    onReportClick={handleMapReportClick}
                    height="500px"
                  />
                </div>
              </CardContent>
            </Card>

            {selectedReport && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="arabic-text">تفاصيل البلاغ المحدد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 arabic-text">نوع البلاغ</p>
                      <p className="text-lg font-semibold text-gray-900 arabic-text">{selectedReport.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 arabic-text">الحالة</p>
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {getStatusText(selectedReport.status)}
                      </Badge>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-600 arabic-text mb-2">وصف المشكلة</p>
                      <p className="text-sm text-gray-900 arabic-text">{selectedReport.description}</p>
                    </div>
                    {selectedReport.location_lat && selectedReport.location_lng && (
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-600 arabic-text">الموقع الجغرافي</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openInMaps(selectedReport.location_lat!, selectedReport.location_lng!)}
                            className="flex items-center space-x-2 rtl:space-x-reverse"
                          >
                            <MapPin className="h-4 w-4" />
                            <span>عرض في الخرائط</span>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
