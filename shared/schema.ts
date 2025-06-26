import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  district: text("district").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  responded: boolean("responded").default(false).notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// CMS Content Management
export const cmsContent = pgTable("cms_content", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'policy', 'news', 'announcement', 'document'
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("draft"), // 'draft', 'published', 'archived'
  metadata: json("metadata"), // Additional structured data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Training Documents
export const aiTrainingDocs = pgTable("ai_training_docs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'policy', 'faq', 'biography', 'speech'
  tags: text("tags").array(), // Searchable tags
  embedding: text("embedding"), // Vector embedding for semantic search
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Speech Training Data
export const speechTrainingData = pgTable("speech_training_data", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  audioPath: text("audio_path"), // Path to audio file
  phonetics: text("phonetics"), // Phonetic transcription
  speaker: text("speaker").notNull().default("candidate"), // 'candidate', 'training'
  context: text("context"), // Context of the speech
  isValidated: boolean("is_validated").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User management for CMS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("editor"), // 'admin', 'editor', 'viewer'
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  responded: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertCmsContentSchema = createInsertSchema(cmsContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiTrainingDocSchema = createInsertSchema(aiTrainingDocs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpeechTrainingSchema = createInsertSchema(speechTrainingData).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertCmsContent = z.infer<typeof insertCmsContentSchema>;
export type CmsContent = typeof cmsContent.$inferSelect;

export type InsertAiTrainingDoc = z.infer<typeof insertAiTrainingDocSchema>;
export type AiTrainingDoc = typeof aiTrainingDocs.$inferSelect;

export type InsertSpeechTraining = z.infer<typeof insertSpeechTrainingSchema>;
export type SpeechTraining = typeof speechTrainingData.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
