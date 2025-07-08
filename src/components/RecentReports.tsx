
import React from 'react';
import { Clock, MapPin, Eye } from 'lucide-react';

// Mock data for recent reports
const recentReports = [
  {
    id: 1,
    type: 'حفرة في الطريق',
    location: 'شارع الملك فهد، الرياض',
    status: 'pending',
    date: '2024-07-08',
    time: '14:30'
  },
  {
    id: 2,
    type: 'إضاءة معطلة',
    location: 'طريق الأمير محمد بن عبدالعزيز',
    status: 'in-progress',
    date: '2024-07-08',
    time: '12:15'
  },
  {
    id: 3,
    type: 'رصيف مكسور',
    location: 'شارع العليا الرئيسي',
    status: 'completed',
    date: '2024-07-07',
    time: '16:45'
  },
  {
    id: 4,
    type: 'انتهاك في الطريق',
    location: 'طريق الدائري الشرقي',
    status: 'pending',
    date: '2024-07-07',
    time: '10:20'
  },
  {
    id: 5,
    type: 'حفرة في الطريق',
    location: 'شارع التحلية',
    status: 'in-progress',
    date: '2024-07-06',
    time: '09:30'
  }
];

const RecentReports = () => {
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

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {recentReports.map((report) => (
        <div 
          key={report.id} 
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900 arabic-text">{report.type}</h4>
            <span className={`status-badge text-xs ${getStatusColor(report.status)}`}>
              {getStatusText(report.status)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2 arabic-text">
            <MapPin className="h-4 w-4 ml-1" />
            <span>{report.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 arabic-text">
              <Clock className="h-3 w-3 ml-1" />
              <span>{report.date} - {report.time}</span>
            </div>
            
            <button className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors">
              <Eye className="h-3 w-3 ml-1" />
              <span>عرض</span>
            </button>
          </div>
        </div>
      ))}
      
      {recentReports.length === 0 && (
        <div className="text-center py-8 text-gray-500 arabic-text">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد بلاغات حديثة</p>
        </div>
      )}
    </div>
  );
};

export default RecentReports;
