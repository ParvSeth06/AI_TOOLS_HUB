import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import {
  personaFlowRequestSchema,
  summarizerInputSchema,
  blogWriterInputSchema,
  flowchartInputSchema,
  courseInputSchema,
} from "@shared/schema";

// Using Gemini API (blueprint:javascript_gemini)
// The newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
let geminiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API key is not configured. Please add your GOOGLE_API_KEY secret to continue.");
    }
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

function checkApiKey(): boolean {
  return !!process.env.GOOGLE_API_KEY;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      geminiConfigured: checkApiKey() 
    });
  });

  // PersonaFlow Chat Endpoint
  app.post("/api/persona-flow/chat", async (req, res) => {
    try {
      if (!checkApiKey()) {
        return res.status(503).json({ 
          error: "Google API key is not configured. Please add your GOOGLE_API_KEY secret to use this feature." 
        });
      }

      const validation = personaFlowRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.errors 
        });
      }

      const { persona, messages, userMessage } = validation.data;

      const systemPrompt = `You are ${persona.name}. 
Background: ${persona.background}
Communication Style: ${persona.communicationStyle}
Personality: ${persona.personality}

You must always stay in character. Respond as this persona would, maintaining their unique voice, vocabulary, attitude, and behavior. Never break character or acknowledge that you are an AI.`;

      // Build conversation history for Gemini
      let conversationContext = "";
      for (const m of messages) {
        if (m.role === "user") {
          conversationContext += `User: ${m.content}\n`;
        } else {
          conversationContext += `${persona.name}: ${m.content}\n`;
        }
      }
      conversationContext += `User: ${userMessage}\n${persona.name}:`;

      const response = await getGemini().models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: conversationContext,
      });

      const assistantMessage = response.text || "I couldn't generate a response.";

      res.json({ response: assistantMessage });
    } catch (error: any) {
      console.error("PersonaFlow error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // AI Summarizer Endpoint
  app.post("/api/summarizer", async (req, res) => {
    try {
      if (!checkApiKey()) {
        return res.status(503).json({ 
          error: "Google API key is not configured. Please add your GOOGLE_API_KEY secret to use this feature." 
        });
      }

      const validation = summarizerInputSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.errors 
        });
      }

      const { inputType, content, detailLevel } = validation.data;

      let contentToSummarize = content;
      let sourceInfo = "";

      if (inputType === "youtube") {
        sourceInfo = `YouTube video URL: ${content}\n\nPlease analyze and summarize the likely content of this video based on the URL and video ID. If you cannot access the actual video, provide a helpful summary based on any context clues in the URL.`;
        contentToSummarize = sourceInfo;
      } else if (inputType === "url") {
        sourceInfo = `Webpage URL: ${content}\n\nPlease analyze and summarize the likely content of this webpage. If you cannot access the actual page, explain what type of content might be found there based on the URL.`;
        contentToSummarize = sourceInfo;
      }

      const detailInstructions = {
        brief: "Provide a very concise summary in 2-3 sentences with 3 key points.",
        standard: "Provide a balanced summary in 4-6 sentences with 5 key points.",
        detailed: "Provide a comprehensive summary in 8-10 sentences with 7-8 key points.",
      };

      const prompt = `${detailInstructions[detailLevel]}

Content to summarize:
${contentToSummarize}

Respond with a JSON object in this exact format:
{
  "summary": "The main summary text",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "wordCount": number
}`;

      const response = await getGemini().models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an expert content summarizer. Extract the essential points and present information clearly and concisely. Always respond with valid JSON only, no markdown formatting.",
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const resultText = response.text || "{}";
      const result = JSON.parse(resultText);
      res.json(result);
    } catch (error: any) {
      console.error("Summarizer error:", error);
      res.status(500).json({ error: error.message || "Failed to generate summary" });
    }
  });

  // Blog Writer Endpoint
  app.post("/api/blog-writer", async (req, res) => {
    try {
      if (!checkApiKey()) {
        return res.status(503).json({ 
          error: "Google API key is not configured. Please add your GOOGLE_API_KEY secret to use this feature." 
        });
      }

      const validation = blogWriterInputSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.errors 
        });
      }

      const { inputType, content, tone } = validation.data;

      let sourceInfo = "";
      if (inputType === "youtube") {
        sourceInfo = `Create a blog post based on this YouTube video URL: ${content}. Imagine the content of the video and write an engaging article about it.`;
      } else if (inputType === "url") {
        sourceInfo = `Create a blog post inspired by this webpage URL: ${content}. Imagine the content and write an engaging article about the topic.`;
      } else {
        sourceInfo = `Create a blog post about this topic: ${content}`;
      }

      const toneInstructions = {
        professional: "Use a professional, business-appropriate tone. Be authoritative yet approachable.",
        casual: "Use a casual, conversational tone. Be friendly and engaging like talking to a friend.",
        academic: "Use a formal, academic tone. Include scholarly language and structured arguments.",
      };

      const prompt = `${sourceInfo}

Writing tone: ${toneInstructions[tone]}

Create a complete, well-structured blog article with:
1. An attention-grabbing title
2. An engaging introduction (2-3 paragraphs)
3. 3-4 main sections with clear headings
4. A compelling conclusion

Respond with a JSON object in this exact format:
{
  "title": "The blog post title",
  "introduction": "The introduction paragraph(s)",
  "sections": [
    {"heading": "Section 1 Title", "content": "Section 1 content..."},
    {"heading": "Section 2 Title", "content": "Section 2 content..."}
  ],
  "conclusion": "The conclusion paragraph(s)",
  "fullContent": "The complete blog post in markdown format with all sections combined"
}`;

      const response = await getGemini().models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an expert blog writer and content creator. Write engaging, well-structured articles that captivate readers. Always respond with valid JSON only, no markdown formatting.",
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const resultText = response.text || "{}";
      const result = JSON.parse(resultText);
      res.json(result);
    } catch (error: any) {
      console.error("Blog Writer error:", error);
      res.status(500).json({ error: error.message || "Failed to generate blog post" });
    }
  });

  // Flowchart Generator Endpoint
  app.post("/api/flowchart", async (req, res) => {
    try {
      if (!checkApiKey()) {
        return res.status(503).json({ 
          error: "Google API key is not configured. Please add your GOOGLE_API_KEY secret to use this feature." 
        });
      }

      const validation = flowchartInputSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.errors 
        });
      }

      const { processDescription, chartType } = validation.data;

      const chartTypeInstructions = {
        flowchart: "Create a standard flowchart with decision points (diamond shapes) and process steps (rectangles). Use flowchart TD (top-down) syntax.",
        sequence: "Create a sequence diagram showing step-by-step progression. Use sequenceDiagram syntax with participants and arrows.",
        mindmap: "Create a hierarchical mindmap showing the main concept and branches. Use mindmap syntax.",
      };

      const prompt = `Analyze this process and create a ${chartType} diagram:

${processDescription}

${chartTypeInstructions[chartType]}

Important rules for Mermaid syntax:
- Use simple node IDs (A, B, C, etc.)
- Avoid special characters in labels except basic punctuation
- Keep labels concise (under 40 characters)
- Wrap text in quotes if it contains spaces

Respond with a JSON object in this exact format:
{
  "mermaidCode": "The complete Mermaid diagram code starting with the diagram type declaration",
  "steps": ["Step 1 description", "Step 2 description"],
  "description": "A brief explanation of the flowchart"
}

Example for flowchart:
{
  "mermaidCode": "flowchart TD\\n    A[Start] --> B[Process]\\n    B --> C{Decision}\\n    C -->|Yes| D[Action]\\n    C -->|No| E[End]",
  "steps": ["Start", "Process", "Decision point", "Action or End"],
  "description": "A simple decision flowchart"
}`;

      const response = await getGemini().models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an expert at creating Mermaid.js diagrams. Generate clean, valid Mermaid syntax that renders correctly. Always respond with valid JSON only, no markdown formatting. Use only standard Mermaid syntax without custom styling.",
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const resultText = response.text || "{}";
      const result = JSON.parse(resultText);
      
      // Clean up the mermaid code - ensure proper line breaks
      if (result.mermaidCode) {
        result.mermaidCode = result.mermaidCode.replace(/\\n/g, '\n');
      }
      
      res.json(result);
    } catch (error: any) {
      console.error("Flowchart error:", error);
      res.status(500).json({ error: error.message || "Failed to generate flowchart" });
    }
  });

  // Course Generator Endpoint
  app.post("/api/course-generator", async (req, res) => {
    try {
      if (!checkApiKey()) {
        return res.status(503).json({ 
          error: "Google API key is not configured. Please add your GOOGLE_API_KEY secret to use this feature." 
        });
      }

      const validation = courseInputSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.errors 
        });
      }

      const { topic, level, duration } = validation.data;

      const levelInstructions = {
        beginner: "Design for complete beginners with no prior knowledge. Start with fundamentals.",
        intermediate: "Design for learners with basic understanding who want to deepen their knowledge.",
        advanced: "Design for experienced practitioners seeking expert-level mastery.",
      };

      const durationModules = {
        "1-week": { count: 3, perModule: "1-2 days" },
        "1-month": { count: 5, perModule: "5-7 days" },
        "3-months": { count: 8, perModule: "1-2 weeks" },
      };

      const moduleConfig = durationModules[duration];

      const prompt = `Create a comprehensive learning roadmap for: ${topic}

Level: ${levelInstructions[level]}
Duration: ${duration} (${moduleConfig.count} modules, approximately ${moduleConfig.perModule} per module)

For each module, include:
1. A clear, descriptive title
2. A brief description of what will be learned
3. 4-6 specific topics to cover
4. 3-4 learning resources (mix of videos, articles, books, exercises)
5. Estimated duration

Respond with a JSON object in this exact format:
{
  "title": "Complete Course Title",
  "description": "A comprehensive overview of the course (2-3 sentences)",
  "modules": [
    {
      "title": "Module 1 Title",
      "description": "What this module covers",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "resources": [
        {"title": "Resource name", "type": "video", "url": ""},
        {"title": "Resource name", "type": "article", "url": ""},
        {"title": "Resource name", "type": "book"},
        {"title": "Resource name", "type": "exercise"}
      ],
      "duration": "X days/weeks"
    }
  ],
  "totalDuration": "X weeks/months",
  "level": "${level.charAt(0).toUpperCase() + level.slice(1)}"
}

Make the resources practical and realistic. For type, use only: "video", "article", "book", or "exercise".`;

      const response = await getGemini().models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an expert curriculum designer and educational consultant. Create structured, practical learning paths that help students progress efficiently. Always respond with valid JSON only, no markdown formatting.",
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const resultText = response.text || "{}";
      const result = JSON.parse(resultText);
      res.json(result);
    } catch (error: any) {
      console.error("Course Generator error:", error);
      res.status(500).json({ error: error.message || "Failed to generate course" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
