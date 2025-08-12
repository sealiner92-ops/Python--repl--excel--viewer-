import { type Session, type InsertSession, type Execution, type InsertExecution } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createSession(): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  createExecution(execution: InsertExecution): Promise<Execution>;
  getExecutionsBySession(sessionId: string): Promise<Execution[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private executions: Map<string, Execution>;

  constructor() {
    this.sessions = new Map();
    this.executions = new Map();
  }

  async createSession(): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createExecution(insertExecution: InsertExecution): Promise<Execution> {
    const id = randomUUID();
    const execution: Execution = {
      ...insertExecution,
      id,
      executedAt: new Date(),
    };
    this.executions.set(id, execution);
    return execution;
  }

  async getExecutionsBySession(sessionId: string): Promise<Execution[]> {
    return Array.from(this.executions.values())
      .filter((execution) => execution.sessionId === sessionId)
      .sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime());
  }
}

export const storage = new MemStorage();
