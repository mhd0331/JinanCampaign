import { inquiries, chatMessages, type Inquiry, type InsertInquiry, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  markInquiryResponded(id: number): Promise<void>;
  
  // Chat methods
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
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
}

export const storage = new DatabaseStorage();
