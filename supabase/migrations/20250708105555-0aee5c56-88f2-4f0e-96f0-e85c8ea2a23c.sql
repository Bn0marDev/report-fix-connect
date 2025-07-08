
-- إنشاء جدول البلاغات
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_name TEXT NOT NULL,
  reporter_phone TEXT NOT NULL,
  type TEXT NOT NULL,
  custom_type TEXT,
  description TEXT NOT NULL,
  street_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  images TEXT[],
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المسؤولين
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المساهمين للمتصدرين
CREATE TABLE public.contributors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  total_reports INTEGER NOT NULL DEFAULT 0,
  completed_reports INTEGER NOT NULL DEFAULT 0,
  success_rate INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN total_reports = 0 THEN 0 
      ELSE ROUND((completed_reports::DECIMAL / total_reports) * 100)::INTEGER 
    END
  ) STORED,
  badge TEXT NOT NULL DEFAULT 'مبتدئ',
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, phone)
);

-- تفعيل Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للبلاغات (يمكن للجميع القراءة والإنشاء)
CREATE POLICY "Anyone can view reports" 
  ON public.reports 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create reports" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (true);

-- سياسة للتحديث (يمكن للجميع تحديث حالة البلاغ - سيتم تقييدها لاحقاً للمسؤولين فقط)
CREATE POLICY "Anyone can update reports" 
  ON public.reports 
  FOR UPDATE 
  USING (true);

-- سياسات للمساهمين (يمكن للجميع القراءة)
CREATE POLICY "Anyone can view contributors" 
  ON public.contributors 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create contributors" 
  ON public.contributors 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update contributors" 
  ON public.contributors 
  FOR UPDATE 
  USING (true);

-- سياسات للمسؤولين (محدودة)
CREATE POLICY "Admins can view themselves" 
  ON public.admins 
  FOR SELECT 
  USING (true);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_priority ON public.reports(priority);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_contributors_completed_reports ON public.contributors(completed_reports DESC);

-- دالة لتحديث تاريخ التعديل تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء المحفزات
CREATE TRIGGER update_reports_updated_at 
  BEFORE UPDATE ON public.reports 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributors_updated_at 
  BEFORE UPDATE ON public.contributors 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- دالة لتحديث إحصائيات المساهمين تلقائياً
CREATE OR REPLACE FUNCTION update_contributor_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- إنشاء أو تحديث المساهم
  INSERT INTO public.contributors (name, phone, total_reports, completed_reports)
  VALUES (NEW.reporter_name, NEW.reporter_phone, 1, 
    CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END)
  ON CONFLICT (name, phone) 
  DO UPDATE SET 
    total_reports = contributors.total_reports + 1,
    completed_reports = contributors.completed_reports + 
      CASE WHEN NEW.status = 'completed' THEN 1 ELSE 0 END,
    updated_at = now();
    
  -- تحديث الشارة بناءً على عدد البلاغات المكتملة
  UPDATE public.contributors 
  SET badge = CASE 
    WHEN completed_reports >= 40 THEN 'ذهبي'
    WHEN completed_reports >= 30 THEN 'فضي'
    WHEN completed_reports >= 20 THEN 'برونزي'
    WHEN completed_reports >= 10 THEN 'متقدم'
    ELSE 'مبتدئ'
  END
  WHERE name = NEW.reporter_name AND phone = NEW.reporter_phone;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء محفز لتحديث الإحصائيات عند إنشاء بلاغ جديد
CREATE TRIGGER update_contributor_stats_on_insert
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_contributor_stats();

-- دالة لتحديث الإحصائيات عند تغيير حالة البلاغ
CREATE OR REPLACE FUNCTION update_contributor_stats_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- إذا تغيرت الحالة من غير مكتمل إلى مكتمل
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    UPDATE public.contributors 
    SET completed_reports = completed_reports + 1,
        updated_at = now()
    WHERE name = NEW.reporter_name AND phone = NEW.reporter_phone;
  END IF;
  
  -- إذا تغيرت الحالة من مكتمل إلى غير مكتمل
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE public.contributors 
    SET completed_reports = completed_reports - 1,
        updated_at = now()
    WHERE name = NEW.reporter_name AND phone = NEW.reporter_phone;
  END IF;
  
  -- تحديث الشارة
  UPDATE public.contributors 
  SET badge = CASE 
    WHEN completed_reports >= 40 THEN 'ذهبي'
    WHEN completed_reports >= 30 THEN 'فضي'
    WHEN completed_reports >= 20 THEN 'برونزي'
    WHEN completed_reports >= 10 THEN 'متقدم'
    ELSE 'مبتدئ'
  END
  WHERE name = NEW.reporter_name AND phone = NEW.reporter_phone;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء محفز لتحديث الإحصائيات عند تحديث حالة البلاغ
CREATE TRIGGER update_contributor_stats_on_update
  AFTER UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_contributor_stats_on_status_change();
