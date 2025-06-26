import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TrainingContext {
  policies: string[];
  biography: string[];
  speeches: string[];
  faqs: string[];
}

export class AITrainingService {
  private trainingContext: TrainingContext | null = null;
  private lastContextUpdate: Date | null = null;
  private readonly CONTEXT_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  async getTrainingContext(): Promise<TrainingContext> {
    const now = new Date();
    
    // Return cached context if still valid
    if (this.trainingContext && this.lastContextUpdate && 
        (now.getTime() - this.lastContextUpdate.getTime()) < this.CONTEXT_CACHE_DURATION) {
      return this.trainingContext;
    }

    // Fetch fresh training documents
    const allDocs = await storage.getAiTrainingDocs();
    
    const context: TrainingContext = {
      policies: [],
      biography: [],
      speeches: [],
      faqs: []
    };

    // Categorize training documents
    allDocs.forEach(doc => {
      switch (doc.category) {
        case 'policy':
          context.policies.push(doc.content);
          break;
        case 'biography':
          context.biography.push(doc.content);
          break;
        case 'speech':
          context.speeches.push(doc.content);
          break;
        case 'faq':
          context.faqs.push(doc.content);
          break;
      }
    });

    this.trainingContext = context;
    this.lastContextUpdate = now;
    
    return context;
  }

  async generateEnhancedResponse(userMessage: string): Promise<string> {
    const context = await this.getTrainingContext();
    
    // Build contextual prompt with training data
    const systemPrompt = this.buildSystemPrompt(context);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || "죄송합니다. 응답을 생성할 수 없습니다.";
    } catch (error) {
      console.error('Enhanced AI response generation failed:', error);
      throw new Error('AI 응답 생성에 실패했습니다.');
    }
  }

  private buildSystemPrompt(context: TrainingContext): string {
    let prompt = `당신은 진안군수 후보 이우규의 AI 어시스턴트입니다. 
다음 정보를 바탕으로 정확하고 도움이 되는 답변을 제공해주세요.

이우규 후보에 대한 정보:
- 진안군수 후보자
- 국민주권정부와 기본사회위원회 구축을 통한 새로운 지방정치 모델 추진
- 6대 핵심 공약을 중심으로 한 진안군 발전 계획 수립

답변 시 주의사항:
1. 항상 정중하고 친근한 톤으로 답변하세요
2. 구체적인 정책이나 공약에 대해서는 아래 정보를 참고하세요
3. 확실하지 않은 정보는 "정확한 정보는 선거사무소(010-7366-8789)로 문의해주세요"라고 안내하세요
4. 정치적으로 중립적이고 건설적인 답변을 제공하세요

`;

    // Add policy context
    if (context.policies.length > 0) {
      prompt += "\n**핵심 공약 및 정책:**\n";
      context.policies.forEach((policy, index) => {
        prompt += `${index + 1}. ${policy.substring(0, 500)}...\n`;
      });
    }

    // Add biography context
    if (context.biography.length > 0) {
      prompt += "\n**후보자 경력 및 배경:**\n";
      context.biography.forEach((bio, index) => {
        prompt += `${bio.substring(0, 300)}...\n`;
      });
    }

    // Add speech context
    if (context.speeches.length > 0) {
      prompt += "\n**주요 연설 및 발언:**\n";
      context.speeches.forEach((speech, index) => {
        prompt += `${speech.substring(0, 200)}...\n`;
      });
    }

    // Add FAQ context
    if (context.faqs.length > 0) {
      prompt += "\n**자주 묻는 질문:**\n";
      context.faqs.forEach((faq, index) => {
        prompt += `${faq.substring(0, 300)}...\n`;
      });
    }

    return prompt;
  }

  async addTrainingDocument(title: string, content: string, category: string, tags: string[] = []): Promise<void> {
    await storage.createAiTrainingDoc({
      title,
      content,
      category,
      tags
    });

    // Invalidate cache to force refresh on next request
    this.trainingContext = null;
    this.lastContextUpdate = null;
  }

  async searchTrainingDocuments(query: string): Promise<any[]> {
    return await storage.searchAiTrainingDocs(query);
  }

  async updateTrainingDocument(id: number, updates: any): Promise<void> {
    await storage.updateAiTrainingDoc(id, updates);
    
    // Invalidate cache
    this.trainingContext = null;
    this.lastContextUpdate = null;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float"
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error('텍스트 임베딩 생성에 실패했습니다.');
    }
  }

  async findSimilarDocuments(query: string, limit: number = 5): Promise<any[]> {
    // Generate embedding for the query
    const queryEmbedding = await this.generateEmbedding(query);
    
    // In a production environment, you would use vector similarity search
    // For now, we'll use text search as a fallback
    return await this.searchTrainingDocuments(query);
  }

  getTrainingStats(): Promise<{
    totalDocs: number;
    byCategory: Record<string, number>;
    lastUpdated: Date | null;
  }> {
    return new Promise(async (resolve) => {
      const docs = await storage.getAiTrainingDocs();
      const byCategory: Record<string, number> = {};
      
      docs.forEach(doc => {
        byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
      });

      resolve({
        totalDocs: docs.length,
        byCategory,
        lastUpdated: this.lastContextUpdate
      });
    });
  }
}

export const aiTrainingService = new AITrainingService();