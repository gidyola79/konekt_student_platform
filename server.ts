import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Enable parsing of JSON bodies
  app.use(express.json());

  const httpServer = createHttpServer(app);

  // Set up WebSocket server attached to the HTTP server
  const wss = new WebSocketServer({ server: httpServer });

  // Simple in-memory server state for live client tracking
  const clients = new Map<WebSocket, { username?: string; activeChatUser?: string }>();

  wss.on("connection", (ws) => {
    clients.set(ws, {});

    ws.on("message", (rawMessageString) => {
      try {
        const data = JSON.parse(rawMessageString.toString());
        
        if (data.type === "join") {
          const clientInfo = clients.get(ws);
          if (clientInfo) {
            clientInfo.username = data.username;
          }
        } else if (data.type === "track") {
          const clientInfo = clients.get(ws);
          if (clientInfo) {
            clientInfo.activeChatUser = data.activeChatUser;
          }
        }

        // Broadcast to all other connected clients
        const broadcastString = JSON.stringify(data);
        for (const [client, _] of clients.entries()) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(broadcastString);
          }
        }
      } catch (err) {
        console.error("WS error parsing message:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  // API standard health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", clientsCount: wss.clients.size });
  });

  // AI-powered Bio Generation endpoint using gemini-3.5-flash
  app.post("/api/gemini/generate-bio", async (req, res) => {
    const { name, major, year, university, interests, customTone } = req.body;
    
    // Check if key is available: if missing, return high-quality helper bios
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined, returning mock bios helper fallback.");
      const fallbackBios = [
        {
          style: `${customTone || "Friendly"} & Direct`,
          text: `Hey, I'm ${name || "a student"}! Studying ${major || "Digital Media"} (${year || "Junior"} year) at ${university || "Konekt University"}. Happy to share study sheets and connect on projects!`
        },
        {
          style: `Academic & Professional`,
          text: `${major || "Computer Science"} major at ${university || "State University"}. Year: ${year || "Sophomore"}. Interested in ${interests || "autonomous software, study circles, and peer tutoring"}. Let's team up!`
        },
        {
          style: `Creative & Active`,
          text: `${name || "Student"} | ${university || "Konekt State"} | Majoring in ${major || "Design"}. Passionate about ${interests || "finding great resources & listing helpful custom study planners"}. Hit me up to collaborate!`
        }
      ];
      return res.json({ bios: fallbackBios, wasFallback: true });
    }

    try {
      const client = getGenAIClient();
      const prompt = `Craft 3 alternative short bios for a student named "${name || "a user"}" who is a "${year || "some"}" year student majoring in "${major || "their studies"}" at "${university || "their university"}".
${interests ? `Their interests & passions: "${interests}".` : ""}
The desired tone instruction/audience style guideline: "${customTone || "highly creative, modern and professional"}".

Output candidates specifically optimized as short, highly engaging social student bios matching the values specified (max 150 characters each block).`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional copywriter specialized in crafting stellar, short social profile bios for students on academic networking platforms.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                style: {
                  type: Type.STRING,
                  description: "A capsule title describing the tone or theme of this candidate, e.g., 'Creative & Direct', 'Polished Academic', 'Friendly Community Mentor'."
                },
                text: {
                  type: Type.STRING,
                  description: "The complete, highly polished student bio text. Write in first-person ('I am...'). It MUST be 150 characters or less."
                }
              },
              required: ["style", "text"]
            }
          }
        }
      });

      const responseText = response.text || "";
      const parsedBios = JSON.parse(responseText);
      return res.json({ bios: parsedBios });
    } catch (err: any) {
      console.error("Gemini bio generation error:", err);
      return res.status(500).json({ 
        error: err.message || "Failed to generate bios through the Gemini model.",
        wasFallback: true,
        bios: [
          {
            style: "Friendly & Casual",
            text: `Hi! I'm ${name || "a student"} majoring in ${major || "studies"} at ${university || "Konekt"}. Always looking to share resources and find study partners!`
          },
          {
            style: "Professional Core",
            text: `${year || "Undergrad"} ${major || "major"} student at ${university || "Konekt"}. Focused on academic growth, study groups, and sharing helpful exam cheatsheets.`
          }
        ]
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
