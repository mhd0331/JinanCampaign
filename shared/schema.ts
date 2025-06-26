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

// Citizen Suggestions and Feedback System
export const citizenSuggestions = pgTable("citizen_suggestions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'infrastructure', 'education', 'healthcare', 'environment', 'economy', 'other'
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").notNull().default("submitted"), // 'submitted', 'under_review', 'approved', 'implemented', 'rejected'
  submitterName: text("submitter_name").notNull(),
  submitterPhone: text("submitter_phone"),
  submitterEmail: text("submitter_email"),
  submitterDistrict: text("submitter_district"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  expectedBudget: text("expected_budget"),
  expectedTimeline: text("expected_timeline"),
  supportCount: integer("support_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  tags: text("tags").array(),
  adminNotes: text("admin_notes"),
  implementationDate: timestamp("implementation_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Public Feedback and Ratings
export const publicFeedback = pgTable("public_feedback", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'policy_rating', 'service_feedback', 'general_feedback'
  targetId: text("target_id"), // ID of the policy/service being rated
  targetType: text("target_type"), // 'policy', 'service', 'general'
  rating: integer("rating"), // 1-5 star rating
  feedbackText: text("feedback_text"),
  submitterName: text("submitter_name"),
  submitterAge: text("submitter_age"), // '20s', '30s', '40s', '50s', '60+'
  submitterDistrict: text("submitter_district"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  sentiment: text("sentiment"), // 'positive', 'neutral', 'negative'
  isPublic: boolean("is_public").notNull().default(true),
  moderationStatus: text("moderation_status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  moderatorNotes: text("moderator_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Suggestion Support/Votes
export const suggestionSupport = pgTable("suggestion_support", {
  id: serial("id").primaryKey(),
  suggestionId: integer("suggestion_id").notNull().references(() => citizenSuggestions.id),
  supporterName: text("supporter_name"),
  supporterPhone: text("supporter_phone"),
  supporterDistrict: text("supporter_district"),
  supportType: text("support_type").notNull().default("support"), // 'support', 'important', 'urgent'
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Policy Implementation Updates
export const implementationUpdates = pgTable("implementation_updates", {
  id: serial("id").primaryKey(),
  suggestionId: integer("suggestion_id").references(() => citizenSuggestions.id),
  policyId: text("policy_id"), // Reference to existing policy
  updateType: text("update_type").notNull(), // 'progress', 'completion', 'delay', 'modification'
  title: text("title").notNull(),
  description: text("description").notNull(),
  progressPercentage: integer("progress_percentage").default(0),
  budgetUsed: text("budget_used"),
  expectedCompletion: timestamp("expected_completion"),
  actualCompletion: timestamp("actual_completion"),
  attachments: text("attachments").array(), // File paths/URLs
  isPublic: boolean("is_public").notNull().default(true),
  createdBy: text("created_by").notNull(), // Admin/staff member
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

export const insertCitizenSuggestionSchema = createInsertSchema(citizenSuggestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  supportCount: true,
  viewCount: true,
});

export const insertPublicFeedbackSchema = createInsertSchema(publicFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertSuggestionSupportSchema = createInsertSchema(suggestionSupport).omit({
  id: true,
  createdAt: true,
});

export const insertImplementationUpdateSchema = createInsertSchema(implementationUpdates).omit({
  id: true,
  createdAt: true,
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

export type InsertCitizenSuggestion = z.infer<typeof insertCitizenSuggestionSchema>;
export type CitizenSuggestion = typeof citizenSuggestions.$inferSelect;

export type InsertPublicFeedback = z.infer<typeof insertPublicFeedbackSchema>;
export type PublicFeedback = typeof publicFeedback.$inferSelect;

export type InsertSuggestionSupport = z.infer<typeof insertSuggestionSupportSchema>;
export type SuggestionSupport = typeof suggestionSupport.$inferSelect;

export type InsertImplementationUpdate = z.infer<typeof insertImplementationUpdateSchema>;
export type ImplementationUpdate = typeof implementationUpdates.$inferSelect;
