import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Eye, 
  Type, 
  Volume2, 
  Contrast, 
  ZoomIn, 
  ZoomOut, 
  Settings,
  X,
  Play,
  Pause
} from "lucide-react";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  textToSpeech: boolean;
  reducedMotion: boolean;
  focusMode: boolean;
  magnification: number;
}

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : {
      fontSize: 16,
      highContrast: false,
      textToSpeech: false,
      reducedMotion: false,
      focusMode: false,
      magnification: 1
    };
  });
  const [isReading, setIsReading] = useState(false);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size adjustment
    root.style.fontSize = `${settings.fontSize}px`;
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Focus mode
    if (settings.focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }
    
    // Magnification
    root.style.zoom = settings.magnification.toString();
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 16,
      highContrast: false,
      textToSpeech: false,
      reducedMotion: false,
      focusMode: false,
      magnification: 1
    });
  };

  const toggleTextToSpeech = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
    } else {
      readPageContent();
    }
  };

  const readPageContent = () => {
    const content = document.querySelector('main')?.textContent || 
                   document.body.textContent || '';
    
    if ('speechSynthesis' in window && content) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'ko-KR';
      
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Accessibility Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 z-50 w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-colors duration-300"
        aria-label="접근성 설정 열기"
        title="접근성 설정"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">접근성 설정</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="접근성 설정 닫기"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Font Size Control */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    글자 크기
                  </h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                      disabled={settings.fontSize <= 12}
                      aria-label="글자 크기 줄이기"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[4rem] text-center font-mono">
                      {settings.fontSize}px
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                      disabled={settings.fontSize >= 24}
                      aria-label="글자 크기 키우기"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Magnification Control */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    화면 확대
                  </h3>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('magnification', Math.max(0.8, settings.magnification - 0.1))}
                      disabled={settings.magnification <= 0.8}
                      aria-label="화면 축소"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[4rem] text-center font-mono">
                      {Math.round(settings.magnification * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('magnification', Math.min(1.5, settings.magnification + 0.1))}
                      disabled={settings.magnification >= 1.5}
                      aria-label="화면 확대"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* High Contrast Toggle */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Contrast className="h-5 w-5" />
                    고대비 모드
                  </h3>
                  <Button
                    variant={settings.highContrast ? "default" : "outline"}
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    className="w-full"
                    aria-pressed={settings.highContrast}
                  >
                    {settings.highContrast ? '고대비 모드 끄기' : '고대비 모드 켜기'}
                  </Button>
                </div>

                {/* Text to Speech */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    화면 읽기
                  </h3>
                  <Button
                    variant={isReading ? "destructive" : "default"}
                    onClick={toggleTextToSpeech}
                    className="w-full flex items-center gap-2"
                    aria-pressed={isReading}
                  >
                    {isReading ? (
                      <>
                        <Pause className="h-4 w-4" />
                        읽기 중지
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        페이지 읽어주기
                      </>
                    )}
                  </Button>
                </div>

                {/* Reduced Motion Toggle */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">애니메이션 줄이기</h3>
                  <Button
                    variant={settings.reducedMotion ? "default" : "outline"}
                    onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                    className="w-full"
                    aria-pressed={settings.reducedMotion}
                  >
                    {settings.reducedMotion ? '애니메이션 복원' : '애니메이션 줄이기'}
                  </Button>
                </div>

                {/* Focus Mode Toggle */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">집중 모드</h3>
                  <Button
                    variant={settings.focusMode ? "default" : "outline"}
                    onClick={() => updateSetting('focusMode', !settings.focusMode)}
                    className="w-full"
                    aria-pressed={settings.focusMode}
                  >
                    {settings.focusMode ? '집중 모드 끄기' : '집중 모드 켜기'}
                  </Button>
                  <p className="text-sm text-gray-600">
                    집중 모드는 불필요한 요소를 숨기고 핵심 내용에 집중할 수 있게 합니다.
                  </p>
                </div>

                {/* Reset Button */}
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={resetSettings}
                    className="w-full"
                  >
                    모든 설정 초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}