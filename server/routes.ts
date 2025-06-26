import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertChatMessageSchema } from "@shared/schema";
import { getChatResponse } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
