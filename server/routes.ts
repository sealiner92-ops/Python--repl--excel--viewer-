import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExecutionSchema } from "@shared/schema";
import { spawn } from "child_process";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new session
  app.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createSession();
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Get session executions
  app.get("/api/sessions/:sessionId/executions", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const executions = await storage.getExecutionsBySession(sessionId);
      res.json(executions);
    } catch (error) {
      console.error("Error fetching executions:", error);
      res.status(500).json({ error: "Failed to fetch executions" });
    }
  });

  // Execute Python code
  app.post("/api/sessions/:sessionId/execute", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { code } = insertExecutionSchema.pick({ code: true }).parse(req.body);

      // Check if session exists
      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Execute Python code using subprocess
      const pythonProcess = spawn("python3", ["-c", code], {
        timeout: 10000, // 10 second timeout
      });

      let output = "";
      let error = "";

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        try {
          const isError = code !== 0 || error.length > 0;
          const execution = await storage.createExecution({
            sessionId,
            code: req.body.code,
            output: output.trim() || null,
            error: error.trim() || null,
            isError,
          });
          res.json(execution);
        } catch (storageError) {
          console.error("Error storing execution:", storageError);
          res.status(500).json({ error: "Failed to store execution result" });
        }
      });

      pythonProcess.on("error", async (err) => {
        console.error("Python execution error:", err);
        try {
          const execution = await storage.createExecution({
            sessionId,
            code: req.body.code,
            output: null,
            error: `Execution error: ${err.message}`,
            isError: true,
          });
          res.json(execution);
        } catch (storageError) {
          console.error("Error storing execution:", storageError);
          res.status(500).json({ error: "Failed to store execution result" });
        }
      });
    } catch (error) {
      console.error("Error executing code:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to execute code" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
