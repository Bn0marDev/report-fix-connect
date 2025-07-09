
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, AlertTriangle, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Report {
  id: string;
  reporter_name: string;
  type: string;
  status: string;
  created_at: string;
  location_lat?: number;
  location_lng?: number;
}

const RecentReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReports();
  }, []);

  // Helper function to convert Arabic numerals to English
  const toEnglishNumbers = (str: string) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = str;
    for (let i = 0; i < arabicNumbers.length; i++) {
      result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
    }
    return result;
  };

  const fetchRecentReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id, reporter_name, type, status, created_at, location_lat, location_lng')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent reports:', error);
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching recent reports:', error);
    } finally {
      setLoading(false);
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${toEnglishNumbers(diffInMinutes.toString())} دقيقة`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${toEnglishNumbers(diffInHours.toString())} ساعة`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${toEnglishNumbers(diffInDays.toString())} يوم`;
    
    // For older dates, show the actual Gregorian date with English numbers
    const formattedDate = toEnglishNumbers(date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      calendar: 'gregory'
    }));
    return formattedDate;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 arabic-text">لا توجد بلاغات حديثة</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse flex-1 min-w-0">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                #{toEnglishNumbers(report.id.slice(-3))}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 arabic-text text-sm truncate">
                  {report.type}
                </h4>
                <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-gray-600 mt-1">
                  <User className="h-3 w-3 flex-shrink-0" />
                  <span className="arabic-text truncate">{report.reporter_name}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(report.status)} text-xs`}>
              {getStatusText(report.status)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>{formatTimeAgo(report.created_at)}</span>
            </div>
            {report.location_lat && report.location_lng && (
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>موقع محدد</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentReports;
