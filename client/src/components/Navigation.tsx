import { useState } from "react";
import { Menu, X, Flag, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-jinan-blue rounded-full flex items-center justify-center">
              <Flag className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold jinan-green">이우규</h1>
              <p className="text-sm text-gray-600">진안군수 후보</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              홈
            </button>
            <button 
              onClick={() => scrollToSection('candidate')}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              후보소개
            </button>
            <button 
              onClick={() => scrollToSection('policies')}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              6대 공약
            </button>
            <button 
              onClick={() => scrollToSection('districts')}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              면별 공약
            </button>
            <button 
              onClick={() => scrollToSection('data')}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              현황 데이터
            </button>
            <button 
              onClick={() => scrollToSection('documents')}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              자료실
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              연락처
            </button>
            <Link href="/suggestions">
              <Button variant="outline" size="sm" className="ml-4">
                <MessageSquare className="w-4 h-4 mr-2" />
                시민 제안
              </Button>
            </Link>
            <Link href="/cms">
              <Button variant="outline" size="sm" className="ml-2">
                <Settings className="w-4 h-4 mr-2" />
                관리자
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                홈
              </button>
              <button 
                onClick={() => scrollToSection('candidate')}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                후보소개
              </button>
              <button 
                onClick={() => scrollToSection('policies')}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                6대 공약
              </button>
              <button 
                onClick={() => scrollToSection('districts')}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                면별 공약
              </button>
              <button 
                onClick={() => scrollToSection('data')}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                현황 데이터
              </button>
              <button 
                onClick={() => scrollToSection('documents')}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                자료실
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left py-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                연락처
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
