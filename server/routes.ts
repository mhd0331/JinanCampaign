import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertInquirySchema, 
  insertChatMessageSchema,
  insertCmsContentSchema,
  insertAiTrainingDocSchema,
  insertSpeechTrainingSchema,
  insertUserSchema,
  insertCitizenSuggestionSchema,
  insertPublicFeedbackSchema,
  insertSuggestionSupportSchema,
  insertImplementationUpdateSchema
} from "@shared/schema";
import { getChatResponse } from "./services/openai";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment monitoring
  app.get('/health', async (req, res) => {
    try {
      await db.execute(`SELECT 1`);
      res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: process.env.npm_package_version || '1.0.0'
      });
    } catch (error: any) {
      res.status(503).json({ 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message 
      });
    }
  });

  // Inquiry routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.json({ success: true, inquiry });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json({ success: true, inquiries });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ 
          success: false, 
          error: "메시지와 세션 ID가 필요합니다." 
        });
      }

      // Get AI response
      const aiResponse = await getChatResponse(message);
      
      // Save chat message
      const chatMessage = await storage.saveChatMessage({
        sessionId,
        userMessage: message,
        aiResponse: aiResponse.response,
      });

      res.json({ 
        success: true, 
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        messageId: chatMessage.id
      });
    } catch (error: any) {
      console.error("Chat API 오류:", error);
      res.status(500).json({ 
        success: false, 
        error: "AI 상담 서비스에 문제가 발생했습니다." 
      });
    }
  });

  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const history = await storage.getChatHistory(sessionId);
      res.json({ success: true, history });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Document download routes
  app.get("/api/documents", async (req, res) => {
    const documents = [
      {
        id: 1,
        title: "6대 공약 상세 계획서",
        description: "진안군 6대 핵심 공약의 구체적인 추진 방안과 예산 계획",
        type: "pdf",
        icon: "file-pdf",
        color: "red-500"
      },
      {
        id: 2,
        title: "면별 맞춤형 공약서",
        description: "11개 면별 특성에 맞는 맞춤형 정책 방안",
        type: "pdf",
        icon: "file-pdf",
        color: "red-500"
      },
      {
        id: 3,
        title: "기본사회위원회 구축 방안",
        description: "국민주권정부 시대 진안형 기본사회위원회 구축 계획",
        type: "docx",
        icon: "file-word",
        color: "blue-500"
      },
      {
        id: 4,
        title: "진안군 현황 분석",
        description: "인구, 경제, 사회 현황 및 문제점 분석 자료",
        type: "xlsx",
        icon: "chart-bar",
        color: "green-500"
      },
      {
        id: 5,
        title: "후보자 프로필",
        description: "이우규 후보자 상세 이력 및 활동 자료",
        type: "pdf",
        icon: "image",
        color: "purple-500"
      },
      {
        id: 6,
        title: "언론 보도 자료",
        description: "주요 언론의 후보자 및 공약 관련 보도 자료",
        type: "pdf",
        icon: "newspaper",
        color: "indigo-500"
      }
    ];
    
    res.json({ success: true, documents });
  });

  // CMS Content Routes
  app.get("/api/cms/content", async (req, res) => {
    try {
      const { type, status } = req.query;
      const content = await storage.getCmsContent(type as string, status as string);
      res.json({ success: true, content });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/cms/content", async (req, res) => {
    try {
      const validatedData = insertCmsContentSchema.parse(req.body);
      const content = await storage.createCmsContent(validatedData);
      res.json({ success: true, content });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/cms/content/:slug", async (req, res) => {
    try {
      const content = await storage.getCmsContentBySlug(req.params.slug);
      if (!content) {
        return res.status(404).json({ success: false, error: "Content not found" });
      }
      res.json({ success: true, content });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/cms/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.updateCmsContent(id, req.body);
      res.json({ success: true, content });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/cms/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCmsContent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI Training Document Routes
  app.get("/api/ai-training/docs", async (req, res) => {
    try {
      const { category } = req.query;
      const docs = await storage.getAiTrainingDocs(category as string);
      res.json({ success: true, docs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ai-training/docs", async (req, res) => {
    try {
      const validatedData = insertAiTrainingDocSchema.parse(req.body);
      const doc = await storage.createAiTrainingDoc(validatedData);
      res.json({ success: true, doc });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put("/api/ai-training/docs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const doc = await storage.updateAiTrainingDoc(id, req.body);
      res.json({ success: true, doc });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/ai-training/docs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAiTrainingDoc(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/ai-training/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ success: false, error: "Query parameter required" });
      }
      const docs = await storage.searchAiTrainingDocs(q as string);
      res.json({ success: true, docs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Speech Training Routes
  app.get("/api/speech-training", async (req, res) => {
    try {
      const { speaker } = req.query;
      const data = await storage.getSpeechTrainingData(speaker as string);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/speech-training", async (req, res) => {
    try {
      const validatedData = insertSpeechTrainingSchema.parse(req.body);
      const speech = await storage.createSpeechTraining(validatedData);
      res.json({ success: true, speech });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put("/api/speech-training/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const speech = await storage.updateSpeechTraining(id, req.body);
      res.json({ success: true, speech });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/speech-training/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSpeechTraining(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/speech-training/:id/validate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.validateSpeechTraining(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Citizen Suggestions Routes
  app.get("/api/citizen-suggestions", async (req, res) => {
    try {
      const { category, status } = req.query;
      const suggestions = await storage.getCitizenSuggestions(category as string, status as string);
      res.json({ success: true, suggestions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/citizen-suggestions", async (req, res) => {
    try {
      const validatedData = insertCitizenSuggestionSchema.parse(req.body);
      const suggestion = await storage.createCitizenSuggestion(validatedData);
      res.json({ success: true, suggestion });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.get("/api/citizen-suggestions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const suggestion = await storage.getCitizenSuggestionById(id);
      if (!suggestion) {
        return res.status(404).json({ success: false, error: "Suggestion not found" });
      }
      
      // Increment view count
      await storage.incrementSuggestionViews(id);
      
      res.json({ success: true, suggestion });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/citizen-suggestions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const suggestion = await storage.updateCitizenSuggestion(id, req.body);
      res.json({ success: true, suggestion });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/citizen-suggestions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCitizenSuggestion(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/citizen-suggestions/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ success: false, error: "Query parameter required" });
      }
      const suggestions = await storage.searchCitizenSuggestions(q as string);
      res.json({ success: true, suggestions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Public Feedback Routes
  app.get("/api/public-feedback", async (req, res) => {
    try {
      const { type, targetId } = req.query;
      const feedback = await storage.getPublicFeedback(type as string, targetId as string);
      res.json({ success: true, feedback });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/public-feedback", async (req, res) => {
    try {
      const validatedData = insertPublicFeedbackSchema.parse(req.body);
      const feedback = await storage.createPublicFeedback(validatedData);
      res.json({ success: true, feedback });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put("/api/public-feedback/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const feedback = await storage.updatePublicFeedback(id, req.body);
      res.json({ success: true, feedback });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/public-feedback/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePublicFeedback(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/public-feedback/:id/moderate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      await storage.moderatePublicFeedback(id, status, notes);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Suggestion Support Routes
  app.get("/api/citizen-suggestions/:id/support", async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const support = await storage.getSuggestionSupport(suggestionId);
      res.json({ success: true, support });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/citizen-suggestions/:id/support", async (req, res) => {
    try {
      const suggestionId = parseInt(req.params.id);
      const validatedData = insertSuggestionSupportSchema.parse({
        ...req.body,
        suggestionId
      });
      const support = await storage.createSuggestionSupport(validatedData);
      res.json({ success: true, support });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/suggestion-support/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSuggestionSupport(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Implementation Updates Routes
  app.get("/api/implementation-updates", async (req, res) => {
    try {
      const { suggestionId } = req.query;
      const updates = await storage.getImplementationUpdates(
        suggestionId ? parseInt(suggestionId as string) : undefined
      );
      res.json({ success: true, updates });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/implementation-updates", async (req, res) => {
    try {
      const validatedData = insertImplementationUpdateSchema.parse(req.body);
      const update = await storage.createImplementationUpdate(validatedData);
      res.json({ success: true, update });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put("/api/implementation-updates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const update = await storage.updateImplementationUpdate(id, req.body);
      res.json({ success: true, update });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/implementation-updates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteImplementationUpdate(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
