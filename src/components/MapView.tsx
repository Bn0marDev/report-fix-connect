
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Eye } from 'lucide-react';

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    lat: 24.7136,
    lng: 46.6753,
    type: 'حفرة في الطريق',
    status: 'pending',
    description: 'حفرة كبيرة في شارع الملك فهد',
    date: '2024-07-08'
  },
  {
    id: 2,
    lat: 24.7186,
    lng: 46.6803,
    type: 'إضاءة معطلة',
    status: 'in-progress',
    description: 'عمود الإضاءة لا يعمل',
    date: '2024-07-07'
  },
  {
    id: 3,
    lat: 24.7086,
    lng: 46.6703,
    type: 'رصيف مكسور',
    status: 'completed',
    description: 'كسر في الرصيف يعيق المشاة',
    date: '2024-07-06'
  }
];

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
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

  useEffect(() => {
    if (!mapRef.current) return;

    // Simple interactive map implementation
    const mapContainer = mapRef.current;
    
    // Clear existing content
    mapContainer.innerHTML = '';
    
    // Create map background
    const mapBackground = document.createElement('div');
    mapBackground.className = 'w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden rounded-lg';
    mapBackground.style.backgroundImage = `
      radial-gradient(circle at 20% 80%, rgba(120, 219, 226, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 183, 77, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.1) 0%, transparent 50%)
    `;
    
    // Add street-like lines
    const streetLines = document.createElement('div');
    streetLines.innerHTML = `
      <div class="absolute top-1/3 left-0 w-full h-1 bg-gray-300 opacity-60"></div>
      <div class="absolute top-2/3 left-0 w-full h-1 bg-gray-300 opacity-60"></div>
      <div class="absolute left-1/3 top-0 h-full w-1 bg-gray-300 opacity-60"></div>
      <div class="absolute left-2/3 top-0 h-full w-1 bg-gray-300 opacity-60"></div>
    `;
    mapBackground.appendChild(streetLines);
    
    // Add report markers
    mockReports.forEach((report, index) => {
      const marker = document.createElement('div');
      marker.className = 'absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110';
      marker.style.left = `${30 + (index * 20)}%`;
      marker.style.top = `${40 + (index * 10)}%`;
      
      marker.innerHTML = `
        <div class="relative">
          <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg" style="background-color: ${getStatusColor(report.status)}"></div>
          <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      `;
      
      marker.addEventListener('click', () => {
        setSelectedReport(report);
      });
      
      mapBackground.appendChild(marker);
    });
    
    // Add map controls
    const controls = document.createElement('div');
    controls.className = 'absolute top-4 right-4 flex flex-col space-y-2';
    controls.innerHTML = `
      <button class="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </button>
      <button class="bg-white shadow-md rounded-lg p-2 hover:bg-gray-50 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
        </svg>
      </button>
    `;
    
    mapBackground.appendChild(controls);
    mapContainer.appendChild(mapBackground);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full"></div>
      
      {/* Report Details Popup */}
      {selectedReport && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-lg arabic-text">{selectedReport.type}</h4>
              <span className={`status-badge ${
                selectedReport.status === 'pending' ? 'status-pending' :
                selectedReport.status === 'in-progress' ? 'status-in-progress' :
                'status-completed'
              }`}>
                {getStatusText(selectedReport.status)}
              </span>
            </div>
            <button 
              onClick={() => setSelectedReport(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <p className="text-gray-600 arabic-text mb-2">{selectedReport.description}</p>
          <p className="text-sm text-gray-500 arabic-text">تاريخ البلاغ: {selectedReport.date}</p>
          
          <div className="flex justify-between items-center mt-4">
            <button className="flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-800 transition-colors">
              <Eye className="h-4 w-4" />
              <span>عرض التفاصيل</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <h5 className="font-semibold mb-2 arabic-text">حالة البلاغات</h5>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="arabic-text">قيد المراجعة</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="arabic-text">قيد الإصلاح</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="arabic-text">تم الإصلاح</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
