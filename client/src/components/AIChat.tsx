import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, X, Send, Bot, User, Search, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { trackAIChat } from "@/lib/analytics";

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIChat({ isOpen, onOpenChange }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: '안녕하세요! 이우규 후보의 공약에 대해 궁금한 것이 있으시면 언제든 물어보세요.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    trackAIChat('message_sent');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        message: inputMessage,
        sessionId
      });
      
      if (response.ok) {
        const data = await response.json();
        trackAIChat('response_received');
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('AI 응답 실패');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: '죄송합니다. 현재 AI 상담 서비스에 문제가 있습니다. 직접 선거사무소(010-7366-8789)로 문의해주세요.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* AI Chat Service Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">AI 공약 상담 서비스</h2>
          <p className="text-xl mb-8 opacity-90">
            궁금한 공약 내용을 AI가 실시간으로 안내해드립니다
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Bot className="h-16 w-16 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">24시간 상담</h3>
                  <p className="text-sm opacity-80">언제든지 공약 질문 가능</p>
                </div>
                <div className="text-center">
                  <Search className="h-16 w-16 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">문서 검색</h3>
                  <p className="text-sm opacity-80">모든 공약 문서에서 즉시 검색</p>
                </div>
                <div className="text-center">
                  <MapPin className="h-16 w-16 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">지역별 안내</h3>
                  <p className="text-sm opacity-80">우리 동네 맞춤 공약 안내</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="공약에 대해 궁금한 것을 물어보세요..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-jinan-green"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    onClick={() => {
                      trackAIChat('chat_opened');
                      onOpenChange(true);
                    }}
                    className="bg-jinan-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 text-left text-gray-600 text-sm">
                  예시 질문: "마령면 스마트팜 사업은 언제 시작되나요?", "지역화폐는 어떻게 받을 수 있나요?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => onOpenChange(true)}
          className="w-16 h-16 bg-jinan-green rounded-full shadow-lg flex items-center justify-center text-white hover:bg-green-700 transition-all transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader className="bg-jinan-green text-white p-4 rounded-t-lg -m-6 mb-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white">AI 공약 상담</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-gray-200"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="h-96 overflow-y-auto space-y-4 p-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isUser 
                    ? 'bg-jinan-green text-white ml-8' 
                    : 'bg-gray-100 text-gray-800 mr-8'
                }`}>
                  <div className="flex items-center mb-1">
                    {msg.isUser ? <User className="h-4 w-4 mr-1" /> : <Bot className="h-4 w-4 mr-1" />}
                    <span className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mr-8">
                  <p className="text-sm">답변 중입니다...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 pt-4 border-t">
            <Input
              placeholder="궁금한 것을 물어보세요..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-jinan-green hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
