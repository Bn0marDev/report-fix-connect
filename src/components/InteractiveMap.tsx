
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Report {
  id: string;
  location_lat: number;
  location_lng: number;
  type: string;
  status: string;
  description: string;
  created_at: string;
}

interface InteractiveMapProps {
  reports: Report[];
  onReportClick?: (report: Report) => void;
  allowLocationSelect?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  height?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  reports,
  onReportClick,
  allowLocationSelect = false,
  onLocationSelect,
  selectedLocation,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 24.7136, lng: 46.6753 }); // Riyadh coordinates

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!allowLocationSelect || !onLocationSelect) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to map coordinates (simplified)
    const lat = center.lat + ((rect.height / 2 - y) / rect.height) * 0.1;
    const lng = center.lng + ((x - rect.width / 2) / rect.width) * 0.1;
    
    onLocationSelect(lat, lng);
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
  const zoomOut = () => setZoom(prev => Math.max(prev - 1, 1));

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          if (allowLocationSelect && onLocationSelect) {
            onLocationSelect(latitude, longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // Create realistic map background
    const mapBackground = document.createElement('div');
    mapBackground.className = 'w-full h-full relative overflow-hidden rounded-lg cursor-crosshair';
    mapBackground.style.background = `
      radial-gradient(circle at 30% 40%, #4ade80 0%, #22c55e 25%, #16a34a 50%),
      radial-gradient(circle at 70% 60%, #06b6d4 0%, #0891b2 25%, #0e7490 50%),
      linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 25%, #d1d5db 50%, #9ca3af 75%, #6b7280 100%)
    `;
    mapBackground.style.backgroundBlendMode = 'multiply, overlay, normal';

    // Add street-like network pattern
    const streetNetwork = document.createElement('div');
    streetNetwork.innerHTML = `
      <svg class="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" stroke-width="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <!-- Major roads -->
        <path d="M0,100 Q100,80 200,100 T400,100" stroke="#374151" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M0,200 Q100,180 200,200 T400,200" stroke="#374151" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M100,0 Q120,100 100,200 T100,300" stroke="#374151" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M300,0 Q280,100 300,200 T300,300" stroke="#374151" stroke-width="2" fill="none" opacity="0.6"/>
        
        <!-- Neighborhoods -->
        <circle cx="80" cy="80" r="15" fill="#10b981" opacity="0.2"/>
        <circle cx="320" cy="80" r="15" fill="#10b981" opacity="0.2"/>
        <circle cx="80" cy="220" r="15" fill="#10b981" opacity="0.2"/>
        <circle cx="320" cy="220" r="15" fill="#10b981" opacity="0.2"/>
        <circle cx="200" cy="150" r="20" fill="#3b82f6" opacity="0.2"/>
      </svg>
    `;
    mapBackground.appendChild(streetNetwork);

    // Add click handler for location selection
    if (allowLocationSelect) {
      mapBackground.addEventListener('click', (e) => {
        if (!onLocationSelect) return;
        
        const rect = mapBackground.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const lat = center.lat + ((rect.height / 2 - y) / rect.height) * 0.1;
        const lng = center.lng + ((x - rect.width / 2) / rect.width) * 0.1;
        
        onLocationSelect(lat, lng);
      });
    }

    // Add report markers
    reports.forEach((report, index) => {
      if (!report.location_lat || !report.location_lng) return;

      const marker = document.createElement('div');
      marker.className = 'absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10';
      
      // Position markers in a distributed pattern
      const xPos = 20 + (index % 5) * 15 + Math.random() * 10;
      const yPos = 20 + Math.floor(index / 5) * 15 + Math.random() * 10;
      marker.style.left = `${Math.min(xPos, 85)}%`;
      marker.style.top = `${Math.min(yPos, 85)}%`;
      
      marker.innerHTML = `
        <div class="relative group">
          <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg pulse" style="background-color: ${getStatusColor(report.status)}"></div>
          <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ${report.type}
          </div>
        </div>
      `;
      
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onReportClick) {
          onReportClick(report);
        }
      });
      
      mapBackground.appendChild(marker);
    });

    // Add selected location marker
    if (selectedLocation) {
      const selectedMarker = document.createElement('div');
      selectedMarker.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 z-20';
      selectedMarker.style.left = '50%';
      selectedMarker.style.top = '50%';
      
      selectedMarker.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 bg-red-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
          <div class="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      `;
      
      mapBackground.appendChild(selectedMarker);
    }

    mapContainer.appendChild(mapBackground);
  }, [reports, selectedLocation, center, zoom, allowLocationSelect, onLocationSelect, onReportClick]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapRef} className="w-full h-full"></div>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={zoomIn}
          className="bg-white shadow-md hover:bg-gray-50 p-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          className="bg-white shadow-md hover:bg-gray-50 p-2"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          className="bg-white shadow-md hover:bg-gray-50 p-2"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm max-w-[200px]">
        <h5 className="font-semibold mb-2 arabic-text text-xs sm:text-sm">حالة البلاغات</h5>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
            <span className="arabic-text text-xs">قيد المراجعة</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
            <span className="arabic-text text-xs">قيد الإصلاح</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
            <span className="arabic-text text-xs">تم الإصلاح</span>
          </div>
        </div>
      </div>

      {allowLocationSelect && (
        <div className="absolute bottom-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
          <p className="text-xs sm:text-sm text-blue-800 arabic-text text-center">
            انقر على الخريطة لتحديد موقع المشكلة
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
