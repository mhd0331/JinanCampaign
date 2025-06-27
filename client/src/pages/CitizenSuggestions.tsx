import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, ThumbsUp, Eye, MessageSquare, Filter, 
  CheckCircle, Clock, AlertTriangle, XCircle, Star, Heart 
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/data/districts";
import FloatingHomeButton from "@/components/FloatingHomeButton";

interface CitizenSuggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  submitterName: string;
  submitterDistrict: string;
  isAnonymous: boolean;
  expectedBudget?: string;
  expectedTimeline?: string;
  supportCount: number;
  viewCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface PublicFeedback {
  id: number;
  type: string;
  rating?: number;
  feedbackText?: string;
  submitterName?: string;
  submitterAge?: string;
  submitterDistrict?: string;
  isAnonymous: boolean;
  sentiment?: string;
  moderationStatus: string;
  createdAt: string;
}

const categoryColors = {
  infrastructure: "bg-blue-100 text-blue-800 border-blue-200",
  education: "bg-green-100 text-green-800 border-green-200",
  healthcare: "bg-red-100 text-red-800 border-red-200",
  environment: "bg-emerald-100 text-emerald-800 border-emerald-200",
  economy: "bg-purple-100 text-purple-800 border-purple-200",
  administration: "bg-indigo-100 text-indigo-800 border-indigo-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

const statusColors = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  implemented: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

export default function CitizenSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuggestionDialogOpen, setIsSuggestionDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CitizenSuggestion | null>(null);
  const { toast } = useToast();

  // Fetch suggestions
  const { data: suggestionsData } = useQuery({
    queryKey: ['/api/citizen-suggestions', selectedCategory === 'all' ? undefined : selectedCategory, selectedStatus === 'all' ? undefined : selectedStatus],
  });

  // Fetch feedback
  const { data: feedbackData } = useQuery({
    queryKey: ['/api/public-feedback'],
  });

  // Create suggestion mutation
  const createSuggestionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/citizen-suggestions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/citizen-suggestions'] });
      toast({ title: "제안이 성공적으로 제출되었습니다!" });
      setIsSuggestionDialogOpen(false);
    },
  });

  // Create feedback mutation
  const createFeedbackMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/public-feedback', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/public-feedback'] });
      toast({ title: "피드백이 성공적으로 제출되었습니다!" });
      setIsFeedbackDialogOpen(false);
    },
  });

  // Support suggestion mutation
  const supportSuggestionMutation = useMutation({
    mutationFn: ({ suggestionId, data }: { suggestionId: number; data: any }) => 
      apiRequest('POST', `/api/citizen-suggestions/${suggestionId}/support`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/citizen-suggestions'] });
      toast({ title: "지지 표명이 완료되었습니다!" });
    },
  });

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      priority: formData.get('priority') || 'medium',
      submitterName: formData.get('submitterName'),
      submitterPhone: formData.get('submitterPhone'),
      submitterEmail: formData.get('submitterEmail'),
      submitterDistrict: formData.get('submitterDistrict'),
      isAnonymous: formData.get('isAnonymous') === 'on',
      expectedBudget: formData.get('expectedBudget'),
      expectedTimeline: formData.get('expectedTimeline'),
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || []
    };

    createSuggestionMutation.mutate(data);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      type: formData.get('type'),
      targetId: formData.get('targetId'),
      targetType: formData.get('targetType'),
      rating: formData.get('rating') ? parseInt(formData.get('rating') as string) : undefined,
      feedbackText: formData.get('feedbackText'),
      submitterName: formData.get('submitterName'),
      submitterAge: formData.get('submitterAge'),
      submitterDistrict: formData.get('submitterDistrict'),
      isAnonymous: formData.get('isAnonymous') === 'on'
    };

    createFeedbackMutation.mutate(data);
  };

  const handleSupportSuggestion = (suggestionId: number) => {
    const data = {
      supporterName: "익명 지지자",
      supportType: "support",
      isAnonymous: true
    };

    supportSuggestionMutation.mutate({ suggestionId, data });
  };

  const suggestions = suggestionsData?.suggestions || [];
  const feedback = feedbackData?.feedback || [];

  const filteredSuggestions = suggestions.filter((suggestion: CitizenSuggestion) => {
    if (searchQuery && !suggestion.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">시민 제안 및 피드백</h1>
            <p className="text-gray-600 mt-2">진안군 발전을 위한 여러분의 소중한 의견을 들려주세요</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  피드백 남기기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>피드백 남기기</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">피드백 유형</label>
                    <Select name="type">
                      <SelectTrigger>
                        <SelectValue placeholder="피드백 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="policy_rating">정책 평가</SelectItem>
                        <SelectItem value="service_feedback">서비스 피드백</SelectItem>
                        <SelectItem value="general_feedback">일반 의견</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">평점</label>
                    <Select name="rating">
                      <SelectTrigger>
                        <SelectValue placeholder="평점 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ 매우 만족</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ 만족</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ 보통</SelectItem>
                        <SelectItem value="2">⭐⭐ 불만족</SelectItem>
                        <SelectItem value="1">⭐ 매우 불만족</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">피드백 내용</label>
                    <Textarea 
                      name="feedbackText" 
                      placeholder="구체적인 의견이나 개선사항을 알려주세요"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">성명 (선택)</label>
                      <Input name="submitterName" placeholder="실명 또는 닉네임" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">연령대</label>
                      <Select name="submitterAge">
                        <SelectTrigger>
                          <SelectValue placeholder="연령대 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20s">20대</SelectItem>
                          <SelectItem value="30s">30대</SelectItem>
                          <SelectItem value="40s">40대</SelectItem>
                          <SelectItem value="50s">50대</SelectItem>
                          <SelectItem value="60+">60대 이상</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">거주 지역</label>
                    <Select name="submitterDistrict">
                      <SelectTrigger>
                        <SelectValue placeholder="지역 선택" />
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

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="feedbackAnonymous" name="isAnonymous" className="rounded" />
                    <label htmlFor="feedbackAnonymous" className="text-sm">익명으로 제출</label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
                      취소
                    </Button>
                    <Button type="submit" disabled={createFeedbackMutation.isPending}>
                      피드백 제출
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isSuggestionDialogOpen} onOpenChange={setIsSuggestionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  새 제안하기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>새 제안 제출하기</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">카테고리</label>
                      <Select name="category">
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infrastructure">인프라</SelectItem>
                          <SelectItem value="education">교육</SelectItem>
                          <SelectItem value="healthcare">보건의료</SelectItem>
                          <SelectItem value="environment">환경</SelectItem>
                          <SelectItem value="economy">경제</SelectItem>
                          <SelectItem value="administration">행정</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">우선순위</label>
                      <Select name="priority" defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">낮음</SelectItem>
                          <SelectItem value="medium">보통</SelectItem>
                          <SelectItem value="high">높음</SelectItem>
                          <SelectItem value="urgent">긴급</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">제안 제목</label>
                    <Input name="title" placeholder="제안의 핵심을 간단히 요약해주세요" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">제안 내용</label>
                    <Textarea 
                      name="description" 
                      placeholder="제안의 배경, 필요성, 기대효과 등을 자세히 설명해주세요"
                      rows={6}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">예상 예산</label>
                      <Input name="expectedBudget" placeholder="예: 5억원, 정확하지 않아도 됩니다" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">예상 기간</label>
                      <Input name="expectedTimeline" placeholder="예: 6개월, 1년" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">태그</label>
                    <Input name="tags" placeholder="관련 키워드를 쉼표로 구분해서 입력하세요" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">성명</label>
                      <Input name="submitterName" placeholder="실명 또는 닉네임" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">거주 지역</label>
                      <Select name="submitterDistrict">
                        <SelectTrigger>
                          <SelectValue placeholder="지역 선택" />
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">연락처 (선택)</label>
                      <Input name="submitterPhone" placeholder="010-0000-0000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">이메일 (선택)</label>
                      <Input name="submitterEmail" type="email" placeholder="example@email.com" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isAnonymous" name="isAnonymous" className="rounded" />
                    <label htmlFor="isAnonymous" className="text-sm">익명으로 제출</label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsSuggestionDialogOpen(false)}>
                      취소
                    </Button>
                    <Button type="submit" disabled={createSuggestionMutation.isPending}>
                      제안 제출
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="suggestions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">시민 제안</TabsTrigger>
            <TabsTrigger value="feedback">공개 피드백</TabsTrigger>
            <TabsTrigger value="progress">진행 현황</TabsTrigger>
          </TabsList>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="제안 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="infrastructure">인프라</SelectItem>
                  <SelectItem value="education">교육</SelectItem>
                  <SelectItem value="healthcare">보건의료</SelectItem>
                  <SelectItem value="environment">환경</SelectItem>
                  <SelectItem value="economy">경제</SelectItem>
                  <SelectItem value="administration">행정</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="submitted">제출됨</SelectItem>
                  <SelectItem value="under_review">검토중</SelectItem>
                  <SelectItem value="approved">승인됨</SelectItem>
                  <SelectItem value="implemented">시행됨</SelectItem>
                  <SelectItem value="rejected">반려됨</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Suggestions Grid */}
            <div className="grid gap-6">
              {filteredSuggestions.map((suggestion: CitizenSuggestion) => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryColors[suggestion.category as keyof typeof categoryColors]}>
                            {suggestion.category}
                          </Badge>
                          <Badge className={statusColors[suggestion.status as keyof typeof statusColors]}>
                            {suggestion.status}
                          </Badge>
                          <Badge className={priorityColors[suggestion.priority as keyof typeof priorityColors]}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{suggestion.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {suggestion.isAnonymous ? "익명" : suggestion.submitterName} • 
                          {suggestion.submitterDistrict} • 
                          {new Date(suggestion.createdAt).toLocaleDateString('ko-KR')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {suggestion.viewCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {suggestion.supportCount}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3">{suggestion.description}</p>
                    
                    {suggestion.expectedBudget && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>예상 예산:</strong> {suggestion.expectedBudget}
                      </div>
                    )}
                    
                    {suggestion.expectedTimeline && (
                      <div className="text-sm text-gray-600 mb-4">
                        <strong>예상 기간:</strong> {suggestion.expectedTimeline}
                      </div>
                    )}

                    {suggestion.tags && suggestion.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mb-4">
                        {suggestion.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedSuggestion(suggestion)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        자세히 보기
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleSupportSuggestion(suggestion.id)}
                        disabled={supportSuggestionMutation.isPending}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        지지하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid gap-4">
              {feedback.filter((f: PublicFeedback) => f.moderationStatus === 'approved').map((item: PublicFeedback) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{item.type}</Badge>
                          {item.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < item.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <CardDescription>
                          {item.isAnonymous ? "익명" : item.submitterName} • 
                          {item.submitterDistrict} • 
                          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {item.feedbackText && (
                    <CardContent>
                      <p className="text-gray-700">{item.feedbackText}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    시행 완료
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {suggestions.filter((s: CitizenSuggestion) => s.status === 'implemented').length}
                  </div>
                  <p className="text-sm text-gray-600">개 제안</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    검토 중
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {suggestions.filter((s: CitizenSuggestion) => s.status === 'under_review').length}
                  </div>
                  <p className="text-sm text-gray-600">개 제안</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    승인 대기
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {suggestions.filter((s: CitizenSuggestion) => s.status === 'approved').length}
                  </div>
                  <p className="text-sm text-gray-600">개 제안</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    총 제안
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {suggestions.length}
                  </div>
                  <p className="text-sm text-gray-600">개 제안</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>

      {/* Suggestion Detail Modal */}
      <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedSuggestion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedSuggestion.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  <Badge className={categoryColors[selectedSuggestion.category as keyof typeof categoryColors]}>
                    {selectedSuggestion.category === 'infrastructure' ? '인프라' :
                     selectedSuggestion.category === 'education' ? '교육' :
                     selectedSuggestion.category === 'healthcare' ? '보건의료' :
                     selectedSuggestion.category === 'environment' ? '환경' :
                     selectedSuggestion.category === 'economy' ? '경제' :
                     selectedSuggestion.category === 'administration' ? '행정' : '기타'}
                  </Badge>
                  <Badge className={statusColors[selectedSuggestion.status as keyof typeof statusColors]}>
                    {selectedSuggestion.status === 'submitted' ? '제출됨' :
                     selectedSuggestion.status === 'under_review' ? '검토중' :
                     selectedSuggestion.status === 'approved' ? '승인됨' :
                     selectedSuggestion.status === 'implemented' ? '시행됨' : '반려됨'}
                  </Badge>
                  <Badge className={priorityColors[selectedSuggestion.priority as keyof typeof priorityColors]}>
                    {selectedSuggestion.priority === 'low' ? '낮음' :
                     selectedSuggestion.priority === 'medium' ? '보통' :
                     selectedSuggestion.priority === 'high' ? '높음' : '긴급'}
                  </Badge>
                </div>

                {/* Meta Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">제안자:</span> {selectedSuggestion.isAnonymous ? "익명" : selectedSuggestion.submitterName}
                    </div>
                    <div>
                      <span className="font-medium">지역:</span> {selectedSuggestion.submitterDistrict}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedSuggestion.viewCount} 조회</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{selectedSuggestion.supportCount} 지지</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">제안 내용</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedSuggestion.description}</p>
                  </div>
                </div>

                {/* Budget and Timeline */}
                {(selectedSuggestion.expectedBudget || selectedSuggestion.expectedTimeline) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSuggestion.expectedBudget && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">예상 예산</h4>
                        <p className="text-blue-700">{selectedSuggestion.expectedBudget}</p>
                      </div>
                    )}
                    {selectedSuggestion.expectedTimeline && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">예상 기간</h4>
                        <p className="text-green-700">{selectedSuggestion.expectedTimeline}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {selectedSuggestion.tags && selectedSuggestion.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">관련 태그</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedSuggestion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    제출일: {new Date(selectedSuggestion.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <Button 
                    onClick={() => handleSupportSuggestion(selectedSuggestion.id)}
                    disabled={supportSuggestionMutation.isPending}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    이 제안 지지하기
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <FloatingHomeButton />
    </div>
  );
}