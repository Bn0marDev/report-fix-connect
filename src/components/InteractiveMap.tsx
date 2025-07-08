
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

    // Create map background with grid pattern
    const mapBackground = document.createElement('div');
    mapBackground.className = 'w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden rounded-lg cursor-crosshair';
    mapBackground.style.backgroundImage = `
      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
    `;
    mapBackground.style.backgroundSize = '20px 20px';

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

    // Add street-like lines
    const streetLines = document.createElement('div');
    streetLines.innerHTML = `
      <div class="absolute top-1/4 left-0 w-full h-0.5 bg-gray-300 opacity-60"></div>
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 opacity-60"></div>
      <div class="absolute top-3/4 left-0 w-full h-0.5 bg-gray-300 opacity-60"></div>
      <div class="absolute left-1/4 top-0 h-full w-0.5 bg-gray-300 opacity-60"></div>
      <div class="absolute left-1/2 top-0 h-full w-0.5 bg-gray-300 opacity-60"></div>
      <div class="absolute left-3/4 top-0 h-full w-0.5 bg-gray-300 opacity-60"></div>
    `;
    mapBackground.appendChild(streetLines);

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
