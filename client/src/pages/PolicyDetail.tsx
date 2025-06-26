import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Heart, TrendingUp, Settings, Building, Home, Clock, DollarSign, Target } from "lucide-react";
import { policies } from "@/data/policies";
import PolicyMiniCharts from "@/components/PolicyMiniCharts";
import { trackPolicyView } from "@/lib/analytics";
import Navigation from "@/components/Navigation";
import FloatingHomeButton from "@/components/FloatingHomeButton";
import AIChat from "@/components/AIChat";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const iconMap = {
  Users,
  Heart, 
  TrendingUp,
  Settings,
  Building,
  Home
};

export default function PolicyDetail() {
  const { policyId } = useParams();
  const policy = policies.find(p => p.id === policyId);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (policy) {
      try {
        trackPolicyView(policy.id);
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    }
  }, [policy]);

  const handleContactClick = () => {
    try {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth' });
        window.location.href = '/#contact';
      } else {
        window.location.href = '/#contact';
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "문의하기 페이지로 이동하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleAIChatClick = () => {
    try {
      setIsChatOpen(true);
    } catch (error) {
      toast({
        title: "오류 발생", 
        description: "AI 상담을 시작하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">공약을 찾을 수 없습니다</h1>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[policy.icon as keyof typeof iconMap] || Users;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Header */}
      <div className={`bg-gradient-to-r ${policy.bgGradient} text-white py-12`}>
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Button>
          </Link>
          
          <div className="flex items-center mb-6">
            <div className={`p-4 rounded-full bg-white/20 mr-6`}>
              <IconComponent className="h-12 w-12" />
            </div>
            <div>
              <Badge className="mb-2 bg-white/20 text-white border-white/30">
                {policy.id}번 공약
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{policy.title}</h1>
              <p className="text-xl opacity-90">{policy.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 공약 개요 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-jinan-green" />
                  공약 개요
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">{policy.description}</p>
              </CardContent>
            </Card>

            {/* 세부 내용 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-jinan-green" />
                  세부 실행 계획
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policy.details.map((detail, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-jinan-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 예상 효과 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-jinan-green" />
                  예상 효과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">직접 효과</h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>• 주민 만족도 향상</li>
                      <li>• 행정 효율성 증대</li>
                      <li>• 서비스 품질 개선</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">파급 효과</h4>
                    <ul className="space-y-1 text-green-700">
                      <li>• 지역 경제 활성화</li>
                      <li>• 일자리 창출</li>
                      <li>• 인구 유입 증가</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추진 일정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-jinan-green" />
                  추진 일정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold mr-4">
                      1분기
                    </div>
                    <div>
                      <h4 className="font-semibold">기반 구축</h4>
                      <p className="text-gray-600">추진 체계 구성 및 예산 확보</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold mr-4">
                      2분기
                    </div>
                    <div>
                      <h4 className="font-semibold">본격 시행</h4>
                      <p className="text-gray-600">핵심 사업 착수 및 실행</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-bold mr-4">
                      3-4분기
                    </div>
                    <div>
                      <h4 className="font-semibold">확산 및 정착</h4>
                      <p className="text-gray-600">성과 확산 및 지속 체계 구축</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 예산 정보 */}
            {policy.budget && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-jinan-green" />
                    예산 규모
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-jinan-green mb-2">{policy.budget}</div>
                    <p className="text-gray-600">연간 추진 예산</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 데이터 차트 */}
            <Card>
              <CardHeader>
                <CardTitle>관련 데이터</CardTitle>
              </CardHeader>
              <CardContent>
                <PolicyMiniCharts policyId={policy.id} />
              </CardContent>
            </Card>

            {/* 관련 공약 */}
            <Card>
              <CardHeader>
                <CardTitle>관련 공약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {policies
                    .filter(p => p.id !== policy.id)
                    .slice(0, 3)
                    .map((relatedPolicy) => (
                      <Link key={relatedPolicy.id} href={`/policy/${relatedPolicy.id}`}>
                        <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <h4 className="font-semibold text-sm mb-1">{relatedPolicy.title}</h4>
                          <p className="text-xs text-gray-600">{relatedPolicy.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* 문의하기 */}
            <Card>
              <CardHeader>
                <CardTitle>문의하기</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  이 공약에 대해 더 자세히 알고 싶으시거나 의견이 있으시면 언제든 연락해주세요.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={handleContactClick}
                    className="w-full bg-jinan-green hover:bg-green-700"
                  >
                    문의하기
                  </Button>
                  <Button 
                    onClick={handleAIChatClick}
                    variant="outline" 
                    className="w-full"
                  >
                    AI 상담하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <FloatingHomeButton />
      <AIChat isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}