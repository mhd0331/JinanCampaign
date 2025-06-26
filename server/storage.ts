import { 
  inquiries, 
  chatMessages,
  cmsContent,
  aiTrainingDocs,
  speechTrainingData,
  users,
  citizenSuggestions,
  publicFeedback,
  suggestionSupport,
  implementationUpdates,
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
  type InsertUser,
  type CitizenSuggestion,
  type InsertCitizenSuggestion,
  type PublicFeedback,
  type InsertPublicFeedback,
  type SuggestionSupport,
  type InsertSuggestionSupport,
  type ImplementationUpdate,
  type InsertImplementationUpdate
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, ilike, sql } from "drizzle-orm";

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
  
  // Citizen suggestion methods
  createCitizenSuggestion(suggestion: InsertCitizenSuggestion): Promise<CitizenSuggestion>;
  getCitizenSuggestions(category?: string, status?: string): Promise<CitizenSuggestion[]>;
  getCitizenSuggestionById(id: number): Promise<CitizenSuggestion | undefined>;
  updateCitizenSuggestion(id: number, updates: Partial<CitizenSuggestion>): Promise<CitizenSuggestion>;
  deleteCitizenSuggestion(id: number): Promise<void>;
  incrementSuggestionViews(id: number): Promise<void>;
  searchCitizenSuggestions(query: string): Promise<CitizenSuggestion[]>;
  
  // Public feedback methods
  createPublicFeedback(feedback: InsertPublicFeedback): Promise<PublicFeedback>;
  getPublicFeedback(type?: string, targetId?: string): Promise<PublicFeedback[]>;
  updatePublicFeedback(id: number, updates: Partial<PublicFeedback>): Promise<PublicFeedback>;
  deletePublicFeedback(id: number): Promise<void>;
  moderatePublicFeedback(id: number, status: string, notes?: string): Promise<void>;
  
  // Suggestion support methods
  createSuggestionSupport(support: InsertSuggestionSupport): Promise<SuggestionSupport>;
  getSuggestionSupport(suggestionId: number): Promise<SuggestionSupport[]>;
  deleteSuggestionSupport(id: number): Promise<void>;
  
  // Implementation update methods
  createImplementationUpdate(update: InsertImplementationUpdate): Promise<ImplementationUpdate>;
  getImplementationUpdates(suggestionId?: number): Promise<ImplementationUpdate[]>;
  updateImplementationUpdate(id: number, updates: Partial<ImplementationUpdate>): Promise<ImplementationUpdate>;
  deleteImplementationUpdate(id: number): Promise<void>;
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

  // Citizen Suggestion Methods
  async createCitizenSuggestion(insertSuggestion: InsertCitizenSuggestion): Promise<CitizenSuggestion> {
    const [suggestion] = await db
      .insert(citizenSuggestions)
      .values({
        ...insertSuggestion,
        updatedAt: new Date()
      })
      .returning();
    return suggestion;
  }

  async getCitizenSuggestions(category?: string, status?: string): Promise<CitizenSuggestion[]> {
    if (category && status) {
      return await db
        .select()
        .from(citizenSuggestions)
        .where(and(eq(citizenSuggestions.category, category), eq(citizenSuggestions.status, status)))
        .orderBy(desc(citizenSuggestions.updatedAt));
    } else if (category) {
      return await db
        .select()
        .from(citizenSuggestions)
        .where(eq(citizenSuggestions.category, category))
        .orderBy(desc(citizenSuggestions.updatedAt));
    } else if (status) {
      return await db
        .select()
        .from(citizenSuggestions)
        .where(eq(citizenSuggestions.status, status))
        .orderBy(desc(citizenSuggestions.updatedAt));
    }

    return await db
      .select()
      .from(citizenSuggestions)
      .orderBy(desc(citizenSuggestions.updatedAt));
  }

  async getCitizenSuggestionById(id: number): Promise<CitizenSuggestion | undefined> {
    const [suggestion] = await db
      .select()
      .from(citizenSuggestions)
      .where(eq(citizenSuggestions.id, id));
    return suggestion;
  }

  async updateCitizenSuggestion(id: number, updateData: Partial<CitizenSuggestion>): Promise<CitizenSuggestion> {
    const [suggestion] = await db
      .update(citizenSuggestions)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(citizenSuggestions.id, id))
      .returning();
    return suggestion;
  }

  async deleteCitizenSuggestion(id: number): Promise<void> {
    await db.delete(citizenSuggestions).where(eq(citizenSuggestions.id, id));
  }

  async incrementSuggestionViews(id: number): Promise<void> {
    await db
      .update(citizenSuggestions)
      .set({
        viewCount: sql`${citizenSuggestions.viewCount} + 1`
      })
      .where(eq(citizenSuggestions.id, id));
  }

  async searchCitizenSuggestions(query: string): Promise<CitizenSuggestion[]> {
    return await db
      .select()
      .from(citizenSuggestions)
      .where(
        ilike(citizenSuggestions.title, `%${query}%`)
      )
      .orderBy(desc(citizenSuggestions.updatedAt));
  }

  // Public Feedback Methods
  async createPublicFeedback(insertFeedback: InsertPublicFeedback): Promise<PublicFeedback> {
    const [feedback] = await db
      .insert(publicFeedback)
      .values(insertFeedback)
      .returning();
    return feedback;
  }

  async getPublicFeedback(type?: string, targetId?: string): Promise<PublicFeedback[]> {
    if (type && targetId) {
      return await db
        .select()
        .from(publicFeedback)
        .where(and(eq(publicFeedback.type, type), eq(publicFeedback.targetId, targetId)))
        .orderBy(desc(publicFeedback.createdAt));
    } else if (type) {
      return await db
        .select()
        .from(publicFeedback)
        .where(eq(publicFeedback.type, type))
        .orderBy(desc(publicFeedback.createdAt));
    }

    return await db
      .select()
      .from(publicFeedback)
      .orderBy(desc(publicFeedback.createdAt));
  }

  async updatePublicFeedback(id: number, updateData: Partial<PublicFeedback>): Promise<PublicFeedback> {
    const [feedback] = await db
      .update(publicFeedback)
      .set(updateData)
      .where(eq(publicFeedback.id, id))
      .returning();
    return feedback;
  }

  async deletePublicFeedback(id: number): Promise<void> {
    await db.delete(publicFeedback).where(eq(publicFeedback.id, id));
  }

  async moderatePublicFeedback(id: number, status: string, notes?: string): Promise<void> {
    await db
      .update(publicFeedback)
      .set({
        moderationStatus: status,
        moderatorNotes: notes
      })
      .where(eq(publicFeedback.id, id));
  }

  // Suggestion Support Methods
  async createSuggestionSupport(insertSupport: InsertSuggestionSupport): Promise<SuggestionSupport> {
    const [support] = await db
      .insert(suggestionSupport)
      .values(insertSupport)
      .returning();

    // Update support count in suggestions table
    await db
      .update(citizenSuggestions)
      .set({
        supportCount: sql`${citizenSuggestions.supportCount} + 1`
      })
      .where(eq(citizenSuggestions.id, insertSupport.suggestionId));

    return support;
  }

  async getSuggestionSupport(suggestionId: number): Promise<SuggestionSupport[]> {
    return await db
      .select()
      .from(suggestionSupport)
      .where(eq(suggestionSupport.suggestionId, suggestionId))
      .orderBy(desc(suggestionSupport.createdAt));
  }

  async deleteSuggestionSupport(id: number): Promise<void> {
    // Get the suggestion ID before deletion
    const [support] = await db
      .select()
      .from(suggestionSupport)
      .where(eq(suggestionSupport.id, id));

    if (support) {
      await db.delete(suggestionSupport).where(eq(suggestionSupport.id, id));

      // Update support count in suggestions table
      await db
        .update(citizenSuggestions)
        .set({
          supportCount: sql`${citizenSuggestions.supportCount} - 1`
        })
        .where(eq(citizenSuggestions.id, support.suggestionId));
    }
  }

  // Implementation Update Methods
  async createImplementationUpdate(insertUpdate: InsertImplementationUpdate): Promise<ImplementationUpdate> {
    const [update] = await db
      .insert(implementationUpdates)
      .values(insertUpdate)
      .returning();
    return update;
  }

  async getImplementationUpdates(suggestionId?: number): Promise<ImplementationUpdate[]> {
    if (suggestionId) {
      return await db
        .select()
        .from(implementationUpdates)
        .where(eq(implementationUpdates.suggestionId, suggestionId))
        .orderBy(desc(implementationUpdates.createdAt));
    }

    return await db
      .select()
      .from(implementationUpdates)
      .orderBy(desc(implementationUpdates.createdAt));
  }

  async updateImplementationUpdate(id: number, updateData: Partial<ImplementationUpdate>): Promise<ImplementationUpdate> {
    const [update] = await db
      .update(implementationUpdates)
      .set(updateData)
      .where(eq(implementationUpdates.id, id))
      .returning();
    return update;
  }

  async deleteImplementationUpdate(id: number): Promise<void> {
    await db.delete(implementationUpdates).where(eq(implementationUpdates.id, id));
  }
}

export const storage = new DatabaseStorage();
