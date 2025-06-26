import { 
  inquiries, 
  chatMessages,
  cmsContent,
  aiTrainingDocs,
  speechTrainingData,
  users,
  type Inquiry, 
  type InsertInquiry, 
  type ChatMessage, 
  type InsertChatMessage,
  type CmsContent,
  type InsertCmsContent,
  type AiTrainingDoc,
  type InsertAiTrainingDoc,
  type SpeechTraining,
  type InsertSpeechTraining,
  type User,
  type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, ilike } from "drizzle-orm";

export interface IStorage {
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  markInquiryResponded(id: number): Promise<void>;
  
  // Chat methods
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
  
  // CMS methods
  createCmsContent(content: InsertCmsContent): Promise<CmsContent>;
  getCmsContent(type?: string, status?: string): Promise<CmsContent[]>;
  getCmsContentBySlug(slug: string): Promise<CmsContent | undefined>;
  updateCmsContent(id: number, content: Partial<CmsContent>): Promise<CmsContent>;
  deleteCmsContent(id: number): Promise<void>;
  
  // AI Training methods
  createAiTrainingDoc(doc: InsertAiTrainingDoc): Promise<AiTrainingDoc>;
  getAiTrainingDocs(category?: string): Promise<AiTrainingDoc[]>;
  updateAiTrainingDoc(id: number, doc: Partial<AiTrainingDoc>): Promise<AiTrainingDoc>;
  deleteAiTrainingDoc(id: number): Promise<void>;
  searchAiTrainingDocs(query: string): Promise<AiTrainingDoc[]>;
  
  // Speech Training methods
  createSpeechTraining(speech: InsertSpeechTraining): Promise<SpeechTraining>;
  getSpeechTrainingData(speaker?: string): Promise<SpeechTraining[]>;
  updateSpeechTraining(id: number, speech: Partial<SpeechTraining>): Promise<SpeechTraining>;
  deleteSpeechTraining(id: number): Promise<void>;
  validateSpeechTraining(id: number): Promise<void>;
  
  // User management methods
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  getUsers(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));
  }

  async markInquiryResponded(id: number): Promise<void> {
    await db
      .update(inquiries)
      .set({ responded: true })
      .where(eq(inquiries.id, id));
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  // CMS Content Methods
  async createCmsContent(insertContent: InsertCmsContent): Promise<CmsContent> {
    const [content] = await db
      .insert(cmsContent)
      .values({
        ...insertContent,
        updatedAt: new Date()
      })
      .returning();
    return content;
  }

  async getCmsContent(type?: string, status?: string): Promise<CmsContent[]> {
    if (type && status) {
      return await db
        .select()
        .from(cmsContent)
        .where(and(eq(cmsContent.type, type), eq(cmsContent.status, status)))
        .orderBy(desc(cmsContent.updatedAt));
    } else if (type) {
      return await db
        .select()
        .from(cmsContent)
        .where(eq(cmsContent.type, type))
        .orderBy(desc(cmsContent.updatedAt));
    } else if (status) {
      return await db
        .select()
        .from(cmsContent)
        .where(eq(cmsContent.status, status))
        .orderBy(desc(cmsContent.updatedAt));
    }
    
    return await db
      .select()
      .from(cmsContent)
      .orderBy(desc(cmsContent.updatedAt));
  }

  async getCmsContentBySlug(slug: string): Promise<CmsContent | undefined> {
    const [content] = await db
      .select()
      .from(cmsContent)
      .where(eq(cmsContent.slug, slug));
    return content;
  }

  async updateCmsContent(id: number, updateData: Partial<CmsContent>): Promise<CmsContent> {
    const [content] = await db
      .update(cmsContent)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(cmsContent.id, id))
      .returning();
    return content;
  }

  async deleteCmsContent(id: number): Promise<void> {
    await db.delete(cmsContent).where(eq(cmsContent.id, id));
  }

  // AI Training Document Methods
  async createAiTrainingDoc(insertDoc: InsertAiTrainingDoc): Promise<AiTrainingDoc> {
    const [doc] = await db
      .insert(aiTrainingDocs)
      .values({
        ...insertDoc,
        updatedAt: new Date()
      })
      .returning();
    return doc;
  }

  async getAiTrainingDocs(category?: string): Promise<AiTrainingDoc[]> {
    if (category) {
      return await db
        .select()
        .from(aiTrainingDocs)
        .where(and(eq(aiTrainingDocs.isActive, true), eq(aiTrainingDocs.category, category)))
        .orderBy(desc(aiTrainingDocs.updatedAt));
    }
    
    return await db
      .select()
      .from(aiTrainingDocs)
      .where(eq(aiTrainingDocs.isActive, true))
      .orderBy(desc(aiTrainingDocs.updatedAt));
  }

  async updateAiTrainingDoc(id: number, updateData: Partial<AiTrainingDoc>): Promise<AiTrainingDoc> {
    const [doc] = await db
      .update(aiTrainingDocs)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(aiTrainingDocs.id, id))
      .returning();
    return doc;
  }

  async deleteAiTrainingDoc(id: number): Promise<void> {
    await db
      .update(aiTrainingDocs)
      .set({ isActive: false })
      .where(eq(aiTrainingDocs.id, id));
  }

  async searchAiTrainingDocs(query: string): Promise<AiTrainingDoc[]> {
    return await db
      .select()
      .from(aiTrainingDocs)
      .where(
        and(
          eq(aiTrainingDocs.isActive, true),
          ilike(aiTrainingDocs.content, `%${query}%`)
        )
      )
      .orderBy(desc(aiTrainingDocs.updatedAt));
  }

  // Speech Training Methods
  async createSpeechTraining(insertSpeech: InsertSpeechTraining): Promise<SpeechTraining> {
    const [speech] = await db
      .insert(speechTrainingData)
      .values(insertSpeech)
      .returning();
    return speech;
  }

  async getSpeechTrainingData(speaker?: string): Promise<SpeechTraining[]> {
    if (speaker) {
      return await db
        .select()
        .from(speechTrainingData)
        .where(eq(speechTrainingData.speaker, speaker))
        .orderBy(desc(speechTrainingData.createdAt));
    }
    
    return await db
      .select()
      .from(speechTrainingData)
      .orderBy(desc(speechTrainingData.createdAt));
  }

  async updateSpeechTraining(id: number, updateData: Partial<SpeechTraining>): Promise<SpeechTraining> {
    const [speech] = await db
      .update(speechTrainingData)
      .set(updateData)
      .where(eq(speechTrainingData.id, id))
      .returning();
    return speech;
  }

  async deleteSpeechTraining(id: number): Promise<void> {
    await db.delete(speechTrainingData).where(eq(speechTrainingData.id, id));
  }

  async validateSpeechTraining(id: number): Promise<void> {
    await db
      .update(speechTrainingData)
      .set({ isValidated: true })
      .where(eq(speechTrainingData.id, id));
  }

  // User Management Methods
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.username, username), eq(users.isActive, true)));
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isActive, true))
      .orderBy(desc(users.createdAt));
  }
}

export const storage = new DatabaseStorage();
