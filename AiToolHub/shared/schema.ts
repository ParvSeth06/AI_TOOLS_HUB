import { z } from "zod";

// PersonaFlow Types
export const personaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  background: z.string().min(10, "Background should be at least 10 characters"),
  communicationStyle: z.string().min(5, "Communication style is required"),
  personality: z.string().min(5, "Personality traits are required"),
});

export type Persona = z.infer<typeof personaSchema>;

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const personaFlowRequestSchema = z.object({
  persona: personaSchema,
  messages: z.array(chatMessageSchema),
  userMessage: z.string().min(1, "Message is required"),
});

export type PersonaFlowRequest = z.infer<typeof personaFlowRequestSchema>;

// AI Summarizer Types
export const summarizerInputSchema = z.object({
  inputType: z.enum(["youtube", "url", "text"]),
  content: z.string().min(1, "Content is required"),
  detailLevel: z.enum(["brief", "standard", "detailed"]).default("standard"),
});

export type SummarizerInput = z.infer<typeof summarizerInputSchema>;

export const summaryResultSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  wordCount: z.number(),
});

export type SummaryResult = z.infer<typeof summaryResultSchema>;

// Blog Writer Types
export const blogWriterInputSchema = z.object({
  inputType: z.enum(["youtube", "url", "topic"]),
  content: z.string().min(1, "Content is required"),
  tone: z.enum(["professional", "casual", "academic"]).default("professional"),
});

export type BlogWriterInput = z.infer<typeof blogWriterInputSchema>;

export const blogResultSchema = z.object({
  title: z.string(),
  introduction: z.string(),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.string(),
  })),
  conclusion: z.string(),
  fullContent: z.string(),
});

export type BlogResult = z.infer<typeof blogResultSchema>;

// Flowchart Generator Types
export const flowchartInputSchema = z.object({
  processDescription: z.string().min(10, "Process description should be at least 10 characters"),
  chartType: z.enum(["flowchart", "sequence", "mindmap"]).default("flowchart"),
});

export type FlowchartInput = z.infer<typeof flowchartInputSchema>;

export const flowchartResultSchema = z.object({
  mermaidCode: z.string(),
  steps: z.array(z.string()),
  description: z.string(),
});

export type FlowchartResult = z.infer<typeof flowchartResultSchema>;

// Course Generator Types
export const courseInputSchema = z.object({
  topic: z.string().min(3, "Topic should be at least 3 characters"),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  duration: z.enum(["1-week", "1-month", "3-months"]).default("1-month"),
});

export type CourseInput = z.infer<typeof courseInputSchema>;

export const courseModuleSchema = z.object({
  title: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
  resources: z.array(z.object({
    title: z.string(),
    type: z.enum(["video", "article", "book", "exercise"]),
    url: z.string().optional(),
  })),
  duration: z.string(),
});

export type CourseModule = z.infer<typeof courseModuleSchema>;

export const courseResultSchema = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(courseModuleSchema),
  totalDuration: z.string(),
  level: z.string(),
});

export type CourseResult = z.infer<typeof courseResultSchema>;

// User schema (keeping existing)
export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
