import { Link } from "wouter";
import { policies } from "@/data/policies";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">이우규</h3>
            <p className="text-gray-300">진안군수 후보</p>
            <p className="text-gray-300">군민이 주인인 진안을 만들겠습니다</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">6대 공약</h4>
            <ul className="space-y-2 text-gray-300">
              {policies.map((policy) => (
                <li key={policy.id}>
                  <Link href={`/policy/${policy.id}`}>
                    <button className="hover:text-white transition-colors text-left">
                      {policy.title}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection('candidate')}
                  className="hover:text-white transition-colors"
                >
                  후보소개
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('districts')}
                  className="hover:text-white transition-colors"
                >
                  면별 공약
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('documents')}
                  className="hover:text-white transition-colors"
                >
                  자료실
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">법적 고지</h4>
            <p className="text-gray-300 text-sm">
              이 홈페이지는 공직선거법에 따라 운영되며, 
              모든 정보는 사실에 근거하여 작성되었습니다.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              후원 및 기부에 관한 문의는 선거관리위원회 규정을 확인해 주세요.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 이우규 진안군수 후보 캠페인. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
