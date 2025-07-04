import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useLocation } from "wouter";

export default function FloatingHomeButton() {
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    trackEvent('navigation', 'Home_Button', 'floating_home_button');
    setLocation('/');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-jinan-blue hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-colors duration-300 flex items-center justify-center hover:brightness-110"
      aria-label="홈으로 돌아가기"
    >
      <Home className="h-6 w-6" />
    </Button>
  );
}