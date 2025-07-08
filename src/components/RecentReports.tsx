
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Report {
  id: string;
  type: string;
  street_description: string;
  status: string;
  created_at: string;
}

const RecentReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id, type, street_description, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

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
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (loading) {
    return (
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 max-h-[500px] overflow-y-auto">
      {reports.map((report) => {
        const { date, time } = formatDate(report.created_at);
        
        return (
          <div 
            key={report.id} 
            className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <h4 className="font-medium text-gray-900 arabic-text text-sm sm:text-base truncate flex-1">{report.type}</h4>
              <span className={`status-badge text-xs whitespace-nowrap ${getStatusColor(report.status)}`}>
                {getStatusText(report.status)}
              </span>
            </div>
            
            <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 arabic-text">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 ml-1 flex-shrink-0" />
              <span className="truncate">{report.street_description || 'لم يتم تحديد الموقع'}</span>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center text-xs text-gray-500 arabic-text">
                <Clock className="h-3 w-3 ml-1 flex-shrink-0" />
                <span className="whitespace-nowrap">{date} - {time}</span>
              </div>
              
              <button className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">
                <Eye className="h-3 w-3 ml-1" />
                <span>عرض</span>
              </button>
            </div>
          </div>
        );
      })}
      
      {reports.length === 0 && !loading && (
        <div className="text-center py-6 sm:py-8 text-gray-500 arabic-text">
          <MapPin className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm sm:text-base">لا توجد بلاغات حديثة</p>
        </div>
      )}
    </div>
  );
};

export default RecentReports;
