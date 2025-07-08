
import React, { useState, useRef } from 'react';
import { MapPin, Camera, Send, ArrowRight, Upload, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Report = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reportType: '',
    customType: '',
    description: '',
    streetDescription: '',
    images: [] as File[],
    location: null as { lat: number; lng: number } | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const reportTypes = [
    'حفرة في الطريق',
    'إضاءة معطلة',
    'رصيف مكسور',
    'انتهاك في الطريق',
    'علامات مرورية تالفة',
    'مشكلة في الصرف',
    'أخرى'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles].slice(0, 5) // Max 5 images
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setFormData(prev => ({
            ...prev,
            location
          }));
          toast({
            title: "تم تحديد الموقع بنجاح",
            description: "تم الحصول على موقعك الحالي",
          });
        },
        (error) => {
          toast({
            title: "خطأ في تحديد الموقع",
            description: "لم نتمكن من الحصول على موقعك الحالي",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      toast({
        title: "الموقع غير مدعوم",
        description: "متصفحك لا يدعم خدمة تحديد الموقع",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.reportType || !formData.description) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (!formData.location) {
      toast({
        title: "الموقع مطلوب",
        description: "يرجى تحديد موقع المشكلة على الخريطة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // إعداد البيانات للإرسال
      const reportData = {
        reporter_name: formData.name,
        reporter_phone: formData.phone,
        type: formData.reportType === 'أخرى' ? formData.customType : formData.reportType,
        custom_type: formData.reportType === 'أخرى' ? formData.customType : null,
        description: formData.description,
        street_description: formData.streetDescription,
        location_lat: formData.location.lat,
        location_lng: formData.location.lng,
        status: 'pending',
        priority: 'medium',
        images: [] // سيتم تحديث هذا لاحقاً لرفع الصور
      };

      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "تم إرسال البلاغ بنجاح",
        description: "شكراً لك على المساهمة في تحسين الطرق",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        reportType: '',
        customType: '',
        description: '',
        streetDescription: '',
        images: [],
        location: null
      });
      setCurrentLocation(null);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال البلاغ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="arabic-text">
                <h1 className="text-xl font-bold text-gray-900">إبلاغ جديد</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="mr-2 text-sm text-gray-600 arabic-text">معلومات البلاغ</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="mr-2 text-sm text-gray-600 arabic-text">تحديد الموقع</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="mr-2 text-sm text-gray-600 arabic-text">إرسال البلاغ</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="arabic-text">معلومات المبلغ</CardTitle>
                    <CardDescription className="arabic-text">
                      معلوماتك الشخصية للتواصل معك عند الحاجة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="arabic-text">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="arabic-text"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="arabic-text">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="05xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="arabic-text"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Report Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="arabic-text">تفاصيل البلاغ</CardTitle>
                    <CardDescription className="arabic-text">
                      وصف دقيق للمشكلة المراد الإبلاغ عنها
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportType" className="arabic-text">نوع البلاغ *</Label>
                      <Select onValueChange={(value) => handleInputChange('reportType', value)}>
                        <SelectTrigger className="arabic-text">
                          <SelectValue placeholder="اختر نوع البلاغ" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type} value={type} className="arabic-text">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.reportType === 'أخرى' && (
                      <div className="space-y-2">
                        <Label htmlFor="customType" className="arabic-text">حدد نوع البلاغ</Label>
                        <Input
                          id="customType"
                          type="text"
                          placeholder="اكتب نوع البلاغ"
                          value={formData.customType}
                          onChange={(e) => handleInputChange('customType', e.target.value)}
                          className="arabic-text"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="arabic-text">وصف المشكلة *</Label>
                      <Textarea
                        id="description"
                        placeholder="اكتب وصفاً مفصلاً للمشكلة..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="min-h-[100px] arabic-text"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="streetDescription" className="arabic-text">وصف الشارع والمنطقة</Label>
                      <Textarea
                        id="streetDescription"
                        placeholder="مثال: شارع الملك فهد، بجانب مسجد النور، بعد إشارة المرور الأولى..."
                        value={formData.streetDescription}
                        onChange={(e) => handleInputChange('streetDescription', e.target.value)}
                        className="min-h-[80px] arabic-text"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Images Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="arabic-text">الصور المرفقة</CardTitle>
                    <CardDescription className="arabic-text">
                      أرفق حتى 5 صور توضح المشكلة (اختياري)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500 arabic-text">
                              <span className="font-semibold">انقر لرفع الصور</span> أو اسحب الملفات هنا
                            </p>
                            <p className="text-xs text-gray-500 arabic-text">PNG, JPG حتى 10MB</p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                          />
                        </label>
                      </div>
                      
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Location */}
              <div className="space-y-6">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="arabic-text">تحديد الموقع</CardTitle>
                    <CardDescription className="arabic-text">
                      حدد موقع المشكلة بدقة على الخريطة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      className="w-full btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Target className="h-5 w-5" />
                      <span>استخدم موقعي الحالي</span>
                    </Button>
                    
                    {currentLocation && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MapPin className="h-5 w-5 text-green-600" />
                          <div className="arabic-text">
                            <p className="text-sm font-medium text-green-800">تم تحديد الموقع</p>
                            <p className="text-xs text-green-600">
                              خط العرض: {currentLocation.lat.toFixed(6)}
                            </p>
                            <p className="text-xs text-green-600">
                              خط الطول: {currentLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Simple Map Placeholder */}
                    <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                      <div className="text-center arabic-text">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">خريطة تفاعلية لتحديد الموقع</p>
                        <p className="text-sm text-gray-500 mt-2">(سيتم دمج OpenStreetMap هنا)</p>
                      </div>
                      
                      {currentLocation && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-lg px-12 py-4 flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>إرسال البلاغ</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
