import { Button } from "@/components/ui/button";
import { candidateInfo } from "@/data/candidate";
import candidateImagePath from "@assets/이우규-원형.JPG_1750907328485.png";

interface HeroProps {
  onPolicyClick: () => void;
  onChatClick: () => void;
}

export default function Hero({ onPolicyClick, onChatClick }: HeroProps) {
  return (
    <section 
      id="home" 
      className="relative bg-gradient-to-r from-green-700 to-blue-600 text-white py-20"
      role="banner"
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 
              id="hero-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
            >
              군민이 주인인<br/>
              <span className="text-yellow-300">진안</span>을 만들겠습니다
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed">
              국민주권정부 시대, 진안형 기본사회위원회로<br/>
              모든 군민의 기본적 삶을 보장하겠습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4" role="group" aria-label="주요 행동 버튼">
              <Button 
                onClick={onPolicyClick}
                size="lg"
                className="bg-white text-green-700 px-4 sm:px-6 md:px-8 py-3 md:py-4 text-sm sm:text-base md:text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                aria-label="이우규 후보의 공약을 자세히 확인하기"
              >
                공약 자세히 보기
              </Button>
              <Button 
                onClick={onChatClick}
                variant="outline"
                size="lg"
                className="border-3 border-white bg-transparent text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 text-sm sm:text-base md:text-lg font-bold hover:bg-white hover:text-green-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                aria-label="AI 챗봇과 공약에 대해 상담하기"
              >
                AI 공약 상담하기
              </Button>
            </div>
          </div>
          <div className="flex justify-center" role="img" aria-label="후보자 프로필">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src={candidateImagePath}
                alt="이우규 진안군수 후보자 프로필 사진"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
