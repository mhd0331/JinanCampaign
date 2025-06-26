import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, Upload, FileText, Mic, Brain, Users } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FloatingHomeButton from "@/components/FloatingHomeButton";

interface CmsContent {
  id: number;
  type: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface AiTrainingDoc {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SpeechTrainingData {
  id: number;
  text: string;
  audioPath?: string;
  phonetics?: string;
  speaker: string;
  context?: string;
  isValidated: boolean;
  createdAt: string;
}

export default function CMSDashboard() {
  const [selectedContent, setSelectedContent] = useState<CmsContent | null>(null);
  const [selectedTrainingDoc, setSelectedTrainingDoc] = useState<AiTrainingDoc | null>(null);
  const [selectedSpeechData, setSselectedSpeechData] = useState<SpeechTrainingData | null>(null);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [isSpeechDialogOpen, setIsSpeechDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch CMS content
  const { data: cmsData } = useQuery({
    queryKey: ['/api/cms/content'],
  });

  // Fetch AI training documents
  const { data: trainingData } = useQuery({
    queryKey: ['/api/ai-training/docs'],
  });

  // Fetch speech training data
  const { data: speechData } = useQuery({
    queryKey: ['/api/speech-training'],
  });

  // CMS Content mutations
  const createContentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/cms/content', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/content'] });
      toast({ title: "콘텐츠가 생성되었습니다." });
      setIsContentDialogOpen(false);
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/cms/content/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/content'] });
      toast({ title: "콘텐츠가 업데이트되었습니다." });
      setIsContentDialogOpen(false);
    },
  });

  // AI Training mutations
  const createTrainingDocMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/ai-training/docs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-training/docs'] });
      toast({ title: "AI 훈련 문서가 생성되었습니다." });
      setIsTrainingDialogOpen(false);
    },
  });

  // Speech Training mutations
  const createSpeechMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/speech-training', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/speech-training'] });
      toast({ title: "발화 훈련 데이터가 생성되었습니다." });
      setIsSpeechDialogOpen(false);
    },
  });

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      type: formData.get('type'),
      title: formData.get('title'),
      content: formData.get('content'),
      slug: formData.get('slug'),
      status: formData.get('status'),
      metadata: formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : {}
    };

    if (selectedContent) {
      updateContentMutation.mutate({ id: selectedContent.id, data });
    } else {
      createContentMutation.mutate(data);
    }
  };

  const handleTrainingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || []
    };

    createTrainingDocMutation.mutate(data);
  };

  const handleSpeechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      text: formData.get('text'),
      phonetics: formData.get('phonetics'),
      speaker: formData.get('speaker'),
      context: formData.get('context')
    };

    createSpeechMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CMS 관리 대시보드</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              사용자 관리
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              콘텐츠 관리
            </TabsTrigger>
            <TabsTrigger value="ai-training" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI 훈련
            </TabsTrigger>
            <TabsTrigger value="speech-training" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              발화 훈련
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              분석
            </TabsTrigger>
          </TabsList>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">콘텐츠 관리</h2>
              <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedContent(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    새 콘텐츠
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedContent ? '콘텐츠 수정' : '새 콘텐츠 생성'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleContentSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">유형</label>
                        <Select name="type" defaultValue={selectedContent?.type || ""}>
                          <SelectTrigger>
                            <SelectValue placeholder="콘텐츠 유형 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="policy">공약</SelectItem>
                            <SelectItem value="news">뉴스</SelectItem>
                            <SelectItem value="announcement">공지사항</SelectItem>
                            <SelectItem value="document">문서</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">상태</label>
                        <Select name="status" defaultValue={selectedContent?.status || "draft"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">초안</SelectItem>
                            <SelectItem value="published">게시됨</SelectItem>
                            <SelectItem value="archived">보관됨</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">제목</label>
                      <Input 
                        name="title" 
                        defaultValue={selectedContent?.title || ""} 
                        placeholder="콘텐츠 제목"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">슬러그</label>
                      <Input 
                        name="slug" 
                        defaultValue={selectedContent?.slug || ""} 
                        placeholder="URL 슬러그 (예: my-policy-2024)"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">내용</label>
                      <Textarea 
                        name="content" 
                        defaultValue={selectedContent?.content || ""} 
                        placeholder="콘텐츠 내용을 입력하세요..."
                        rows={8}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">메타데이터 (JSON)</label>
                      <Textarea 
                        name="metadata" 
                        defaultValue={selectedContent?.metadata ? JSON.stringify(selectedContent.metadata, null, 2) : ""} 
                        placeholder='{"description": "페이지 설명", "keywords": ["키워드1", "키워드2"]}'
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsContentDialogOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {cmsData?.content?.map((item: CmsContent) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {item.title}
                          <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {item.type} • {new Date(item.updatedAt).toLocaleDateString('ko-KR')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedContent(item);
                            setIsContentDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Training Tab */}
          <TabsContent value="ai-training" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">AI 훈련 문서</h2>
              <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    훈련 문서 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>AI 훈련 문서 추가</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleTrainingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">카테고리</label>
                        <Select name="category">
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="policy">공약</SelectItem>
                            <SelectItem value="faq">자주 묻는 질문</SelectItem>
                            <SelectItem value="biography">인물 정보</SelectItem>
                            <SelectItem value="speech">연설</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">태그</label>
                        <Input 
                          name="tags" 
                          placeholder="태그1, 태그2, 태그3"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">제목</label>
                      <Input 
                        name="title" 
                        placeholder="훈련 문서 제목"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">내용</label>
                      <Textarea 
                        name="content" 
                        placeholder="AI 훈련을 위한 문서 내용을 입력하세요..."
                        rows={10}
                        required 
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsTrainingDialogOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {trainingData?.docs?.map((doc: AiTrainingDoc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{doc.title}</CardTitle>
                        <CardDescription>
                          {doc.category} • {new Date(doc.updatedAt).toLocaleDateString('ko-KR')}
                        </CardDescription>
                      </div>
                      <Badge variant={doc.isActive ? 'default' : 'secondary'}>
                        {doc.isActive ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2 mb-2">{doc.content}</p>
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Speech Training Tab */}
          <TabsContent value="speech-training" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">발화 훈련 데이터</h2>
              <Dialog open={isSpeechDialogOpen} onOpenChange={setIsSpeechDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    발화 데이터 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>발화 훈련 데이터 추가</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSpeechSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">화자</label>
                        <Select name="speaker">
                          <SelectTrigger>
                            <SelectValue placeholder="화자 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="candidate">후보자</SelectItem>
                            <SelectItem value="training">훈련용</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">컨텍스트</label>
                        <Input 
                          name="context" 
                          placeholder="발화 상황 (예: 연설, 인터뷰)"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">텍스트</label>
                      <Textarea 
                        name="text" 
                        placeholder="발화할 텍스트를 입력하세요..."
                        rows={6}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">발음 기호</label>
                      <Textarea 
                        name="phonetics" 
                        placeholder="발음 기호를 입력하세요 (선택사항)"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsSpeechDialogOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {speechData?.data?.map((item: SpeechTrainingData) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {item.speaker === 'candidate' ? '후보자' : '훈련용'}
                          {item.context && <span className="text-sm text-gray-500">• {item.context}</span>}
                        </CardTitle>
                        <CardDescription>
                          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                        </CardDescription>
                      </div>
                      <Badge variant={item.isValidated ? 'default' : 'secondary'}>
                        {item.isValidated ? '검증됨' : '미검증'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 mb-2">{item.text}</p>
                    {item.phonetics && (
                      <p className="text-sm text-gray-500 font-mono">{item.phonetics}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">분석 및 통계</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>총 콘텐츠</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{cmsData?.content?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI 훈련 문서</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{trainingData?.docs?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>발화 훈련 데이터</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{speechData?.data?.length || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FloatingHomeButton />
    </div>
  );
}