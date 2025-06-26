import { Button } from "@/components/ui/button";
import { candidateInfo } from "@/data/candidate";
import candidateImagePath from "@assets/이우규-원형.JPG_1750907328485.png";

interface HeroProps {
  onPolicyClick: () => void;
  onChatClick: () => void;
}

export default function Hero({ onPolicyClick, onChatClick }: HeroProps) {
  return (
    <section id="home" className="relative bg-gradient-to-r from-green-700 to-blue-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              군민이 주인인<br/>
              <span className="text-yellow-300">진안</span>을 만들겠습니다
            </h1>
            <p className="text-xl mb-8 opacity-90">
              국민주권정부 시대, 진안형 기본사회위원회로<br/>
              모든 군민의 기본적 삶을 보장하겠습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onPolicyClick}
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                공약 자세히 보기
              </Button>
              <Button 
                onClick={onChatClick}
                variant="outline"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors"
              >
                AI 공약 상담하기
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src={candidateImagePath}
                alt="이우규 후보자"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {candidateInfo.stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
