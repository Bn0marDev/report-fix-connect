
import React from 'react';
import { ArrowRight, Github, Linkedin, Mail, Code, Database, Palette, Server } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Developer {
  id: number;
  name: string;
  role: string;
  specialization: string;
  experience: string;
  skills: string[];
  image: string;
  description: string;
  github?: string;
  linkedin?: string;
  email?: string;
  projects: number;
  icon: React.ReactNode;
}

const Developers = () => {
  const frontendDevelopers: Developer[] = [
    {
      id: 1,
      name: "أحمد محمد العلي",
      role: "مطور واجهات أمامية أول",
      specialization: "React & UI/UX",
      experience: "5+ سنوات",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux", "Figma"],
      image: "/placeholder.svg",
      description: "متخصص في تطوير واجهات المستخدم التفاعلية وتجربة المستخدم الحديثة. خبرة واسعة في تطوير تطبيقات الويب المتجاوبة والقابلة للوصول.",
      github: "https://github.com/ahmed-ali",
      linkedin: "https://linkedin.com/in/ahmed-ali",
      email: "ahmed.ali@example.com",
      projects: 25,
      icon: <Code className="h-6 w-6 text-blue-500" />
    },
    {
      id: 2,
      name: "فاطمة سعد الدين",
      role: "مطورة واجهات أمامية",
      specialization: "Vue.js & Design Systems",
      experience: "4+ سنوات",
      skills: ["Vue.js", "JavaScript", "SCSS", "Adobe XD", "Storybook", "Jest"],
      image: "/placeholder.svg",
      description: "مختصة في بناء أنظمة التصميم وتطوير المكونات القابلة لإعادة الاستخدام. شغوفة بتطوير واجهات مستخدم جميلة وفعالة.",
      github: "https://github.com/fatima-saad",
      linkedin: "https://linkedin.com/in/fatima-saad",
      email: "fatima.saad@example.com",
      projects: 18,
      icon: <Palette className="h-6 w-6 text-pink-500" />
    }
  ];

  const backendDevelopers: Developer[] = [
    {
      id: 3,
      name: "محمد عبدالرحمن خالد",
      role: "مهندس برمجيات خلفية أول",
      specialization: "Node.js & Cloud Architecture",
      experience: "6+ سنوات",
      skills: ["Node.js", "Express", "MongoDB", "AWS", "Docker", "Microservices"],
      image: "/placeholder.svg",
      description: "خبير في تطوير الخدمات المصغرة والأنظمة الموزعة. متخصص في بناء APIs قابلة للتوسع وإدارة البنية التحتية السحابية.",
      github: "https://github.com/mohamed-khalid",
      linkedin: "https://linkedin.com/in/mohamed-khalid",
      email: "mohamed.khalid@example.com",
      projects: 32,
      icon: <Server className="h-6 w-6 text-green-500" />
    },
    {
      id: 4,
      name: "عبدالله أحمد النعيمي",
      role: "مطور برمجيات خلفية",
      specialization: "Python & Data Engineering",
      experience: "4+ سنوات",
      skills: ["Python", "Django", "PostgreSQL", "Redis", "Celery", "Apache Kafka"],
      image: "/placeholder.svg",
      description: "متخصص في تطوير تطبيقات الويب عالية الأداء ومعالجة البيانات الضخمة. خبرة في تطوير أنظمة المراسلة والمعالجة اللحظية.",
      github: "https://github.com/abdullah-ahmed",
      linkedin: "https://linkedin.com/in/abdullah-ahmed",
      email: "abdullah.ahmed@example.com",
      projects: 21,
      icon: <Database className="h-6 w-6 text-purple-500" />
    }
  ];

  const DeveloperCard = ({ developer }: { developer: Developer }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 rtl:space-x-reverse mb-4">
          <div className="relative">
            <img
              src={developer.image}
              alt={developer.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-gray-100 group-hover:border-blue-200 transition-colors"
            />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
              {developer.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 arabic-text group-hover:text-blue-600 transition-colors">
              {developer.name}
            </h3>
            <p className="text-sm font-medium text-blue-600 arabic-text mb-1">
              {developer.role}
            </p>
            <p className="text-xs text-gray-500 arabic-text">
              {developer.specialization} • {developer.experience}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 arabic-text mb-4 leading-relaxed">
          {developer.description}
        </p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 arabic-text mb-2">المهارات التقنية:</h4>
          <div className="flex flex-wrap gap-1">
            {developer.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 arabic-text">
            <span className="font-semibold text-gray-700">{developer.projects}</span> مشروع مكتمل
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {developer.github && (
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Github className="h-4 w-4 text-gray-600 hover:text-gray-800 transition-colors" />
              </Button>
            )}
            {developer.linkedin && (
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Linkedin className="h-4 w-4 text-gray-600 hover:text-blue-600 transition-colors" />
              </Button>
            )}
            {developer.email && (
              <Button variant="ghost" size="sm" className="p-2 h-auto">
                <Mail className="h-4 w-4 text-gray-600 hover:text-green-600 transition-colors" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowRight className="h-5 w-5" />
              <span className="arabic-text">العودة للرئيسية</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 arabic-text">فريق التطوير</h1>
              <p className="text-sm text-gray-600 arabic-text">المواهب وراء نجاح التطبيق</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 arabic-text mb-4">
              تعرف على فريق التطوير المتميز
            </h2>
            <p className="text-lg text-gray-600 arabic-text leading-relaxed">
              فريق من المطورين المحترفين والمبدعين الذين يعملون بشغف لتطوير حلول تقنية متطورة وسهلة الاستخدام
            </p>
          </div>
        </div>

        {/* Frontend Developers Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 arabic-text">مطورو الواجهات الأمامية</h3>
                <p className="text-gray-600 arabic-text">خبراء في تطوير تجربة المستخدم والواجهات التفاعلية</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {frontendDevelopers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </div>

        {/* Backend Developers Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 arabic-text">مطورو الخدمات الخلفية</h3>
                <p className="text-gray-600 arabic-text">متخصصون في بناء الأنظمة القوية والقابلة للتوسع</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {backendDevelopers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </div>

        {/* Team Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 arabic-text text-center mb-8">إحصائيات الفريق</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">96</div>
              <p className="text-gray-600 arabic-text text-sm">مشروع مكتمل</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">19+</div>
              <p className="text-gray-600 arabic-text text-sm">سنة خبرة مجمعة</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
              <p className="text-gray-600 arabic-text text-sm">تقنية متقنة</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <p className="text-gray-600 arabic-text text-sm">رضا العملاء</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold arabic-text mb-4">هل تريد العمل معنا؟</h3>
          <p className="text-lg arabic-text mb-6 opacity-90">
            نحن دائماً نبحث عن مواهب جديدة للانضمام إلى فريقنا المتميز
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full arabic-text">
            تواصل معنا
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Developers;
