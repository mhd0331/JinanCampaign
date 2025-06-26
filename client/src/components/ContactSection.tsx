import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Facebook, Youtube, MessageCircle } from "lucide-react";
import { candidateInfo } from "@/data/candidate";
import { districts } from "@/data/districts";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackContactForm } from "@/lib/analytics";
import { validateFormInput, validatePhoneNumber, rateLimiter } from "@/lib/security";
import { logger, perfMonitor } from "@/lib/debug";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const userIdentifier = formData.phone || 'anonymous';
    if (!rateLimiter.isAllowed(userIdentifier)) {
      toast({
        title: "요청 제한",
        description: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
      logger.warn('Rate limit exceeded for form submission', { userIdentifier });
      return;
    }

    // Input validation
    const validation = validateFormInput(formData);
    if (!validation.isValid) {
      toast({
        title: "입력 오류",
        description: validation.errors[0],
        variant: "destructive"
      });
      logger.warn('Form validation failed', { errors: validation.errors });
      return;
    }

    // Phone number validation
    if (!validatePhoneNumber(formData.phone)) {
      toast({
        title: "입력 오류",
        description: "올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const stopTiming = perfMonitor.startTiming('contact_form_submission');
    
    try {
      logger.info('Submitting contact form', { district: formData.district });
      const response = await apiRequest('POST', '/api/inquiries', formData);
      
      if (response.ok) {
        stopTiming();
        trackContactForm('form_submitted');
        logger.info('Contact form submitted successfully');
        toast({
          title: "문의 접수 완료",
          description: "문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.",
        });
        setFormData({ name: '', phone: '', district: '', message: '' });
      } else {
        throw new Error('문의 접수 실패');
      }
    } catch (error) {
      stopTiming();
      trackContactForm('form_error');
      logger.error('Contact form submission failed', error);
      toast({
        title: "문의 접수 실패",
        description: "문의 접수 중 오류가 발생했습니다. 직접 연락해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">연락처 및 후원</h2>
          <p className="text-xl text-gray-600">이우규와 함께 진안의 미래를 만들어 주세요</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold jinan-green mb-6">연락처</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-jinan-green rounded-full flex items-center justify-center">
                  <Phone className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">전화번호</p>
                  <p className="text-gray-600">{candidateInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-jinan-blue rounded-full flex items-center justify-center">
                  <Mail className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">이메일</p>
                  <p className="text-gray-600">{candidateInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-jinan-light-green rounded-full flex items-center justify-center">
                  <MapPin className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">선거사무소</p>
                  <p className="text-gray-600">전북특별자치도 진안군 진안읍</p>
                </div>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">소셜 미디어</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold jinan-green mb-6">문의하기</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full focus:ring-2 focus:ring-jinan-green"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">연락처</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full focus:ring-2 focus:ring-jinan-green"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">거주 지역</label>
                <Select onValueChange={(value) => handleInputChange('district', value)} required>
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-jinan-green">
                    <SelectValue placeholder="거주 지역을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.id} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">문의 내용</label>
                <Textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full focus:ring-2 focus:ring-jinan-green"
                  required
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-jinan-green text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {isSubmitting ? '문의 보내는 중...' : '문의 보내기'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
