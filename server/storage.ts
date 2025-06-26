import { inquiries, chatMessages, type Inquiry, type InsertInquiry, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  markInquiryResponded(id: number): Promise<void>;
  
  // Chat methods
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private inquiries: Map<number, Inquiry>;
  private chatMessages: Map<number, ChatMessage>;
  private currentInquiryId: number;
  private currentChatId: number;

  constructor() {
    this.inquiries = new Map();
    this.chatMessages = new Map();
    this.currentInquiryId = 1;
    this.currentChatId = 1;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = {
      ...insertInquiry,
      id,
      createdAt: new Date(),
      responded: false,
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async markInquiryResponded(id: number): Promise<void> {
    const inquiry = this.inquiries.get(id);
    if (inquiry) {
      this.inquiries.set(id, { ...inquiry, responded: true });
    }
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}

export const storage = new MemStorage();
