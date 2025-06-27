import { useState } from "react";
import { Menu, X, Flag, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    // 현재 페이지가 홈페이지가 아니면 홈페이지로 이동 후 스크롤
    if (location !== '/') {
      window.location.href = `/#${sectionId}`;
      setIsMenuOpen(false);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" role="navigation" aria-label="주 내비게이션">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-jinan-blue rounded-full flex items-center justify-center" aria-hidden="true">
              <Flag className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold jinan-green">이우규</h1>
              <p className="text-sm text-gray-600">진안군수 후보</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6" role="menubar">
            <button 
              onClick={() => scrollToSection('home')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('home'))}
              className="text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2 py-1"
              role="menuitem"
              aria-label="홈 섹션으로 이동"
              tabIndex={0}
            >
              홈
            </button>
            <button 
              onClick={() => scrollToSection('candidate')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('candidate'))}
              className="text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2 py-1"
              role="menuitem"
              aria-label="후보소개 섹션으로 이동"
              tabIndex={0}
            >
              후보소개
            </button>
            <button 
              onClick={() => scrollToSection('policies')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('policies'))}
              className="text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2 py-1"
              role="menuitem"
              aria-label="6대 공약 섹션으로 이동"
              tabIndex={0}
            >
              6대 공약
            </button>
            <button 
              onClick={() => scrollToSection('districts')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('districts'))}
              className="text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2 py-1"
              role="menuitem"
              aria-label="면별 공약 섹션으로 이동"
              tabIndex={0}
            >
              면별 공약
            </button>
            <button 
              onClick={() => scrollToSection('data')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('data'))}
              className="text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2 py-1"
              role="menuitem"
              aria-label="현황 데이터 섹션으로 이동"
              tabIndex={0}
            >
              현황 데이터
            </button>
            <button 
              onClick={() => scrollToSection('documents')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('documents'))}
              className="text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2 py-1"
              role="menuitem"
              aria-label="자료실 섹션으로 이동"
              tabIndex={0}
            >
              자료실
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('contact'))}
              className="text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2 py-1"
              role="menuitem"
              aria-label="연락처 섹션으로 이동"
              tabIndex={0}
            >
              연락처
            </button>
            <Link href="/suggestions">
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                role="menuitem"
                aria-label="시민 제안 페이지로 이동"
                tabIndex={0}
              >
                <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
                시민 제안
              </Button>
            </Link>
            <Link href="/cms">
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                role="menuitem"
                aria-label="관리자 페이지로 이동"
                tabIndex={0}
              >
                <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                관리자
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4" role="menu" aria-labelledby="mobile-menu-button">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('home')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('home'))}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2"
                role="menuitem"
                aria-label="홈 섹션으로 이동"
                tabIndex={0}
              >
                홈
              </button>
              <button 
                onClick={() => scrollToSection('candidate')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('candidate'))}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2"
                role="menuitem"
                aria-label="후보소개 섹션으로 이동"
                tabIndex={0}
              >
                후보소개
              </button>
              <button 
                onClick={() => scrollToSection('policies')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('policies'))}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2"
                role="menuitem"
                aria-label="6대 공약 섹션으로 이동"
                tabIndex={0}
              >
                6대 공약
              </button>
              <button 
                onClick={() => scrollToSection('districts')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('districts'))}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2"
                role="menuitem"
                aria-label="면별 공약 섹션으로 이동"
                tabIndex={0}
              >
                면별 공약
              </button>
              <button 
                onClick={() => scrollToSection('data')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('data'))}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2"
                role="menuitem"
                aria-label="현황 데이터 섹션으로 이동"
                tabIndex={0}
              >
                현황 데이터
              </button>
              <button 
                onClick={() => scrollToSection('documents')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('documents'))}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2"
                role="menuitem"
                aria-label="자료실 섹션으로 이동"
                tabIndex={0}
              >
                자료실
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                onKeyDown={(e) => handleKeyDown(e, () => scrollToSection('contact'))}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 rounded px-2"
                role="menuitem"
                aria-label="연락처 섹션으로 이동"
                tabIndex={0}
              >
                연락처
              </button>
              <div className="pt-4 border-t border-gray-200">
                <Link href="/suggestions">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2" 
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                    aria-label="시민 제안 페이지로 이동"
                    tabIndex={0}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
                    시민 제안
                  </Button>
                </Link>
                <Link href="/cms">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2" 
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                    aria-label="관리자 페이지로 이동"
                    tabIndex={0}
                  >
                    <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                    관리자
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
