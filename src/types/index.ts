// =====================================================================
//  Hamdam – Global Type Definitions
// =====================================================================

// ── Chat Domain ───────────────────────────────────────────────────────

export type ChatMode = 'medical' | 'software';

export type MessageRole = 'user' | 'assistant' | 'system';

export type SafetyLevel = 'safe' | 'caution' | 'emergency';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  mode: ChatMode;
  safetyLevel?: SafetyLevel;
  sources?: KnowledgeSource[];
  isStreaming?: boolean;
  isError?: boolean;
}

export interface KnowledgeSource {
  title: string;
  excerpt: string;
  url?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  mode: ChatMode;
  createdAt: number;
  updatedAt: number;
}

// ── API Types ─────────────────────────────────────────────────────────

export interface ChatRequest {
  sessionId: string;
  message: string;
  mode: ChatMode;
  history: Array<{ role: MessageRole; content: string }>;
}

export interface ChatResponse {
  id: string;
  content: string;
  safetyLevel: SafetyLevel;
  sources?: KnowledgeSource[];
  emergencyAction?: EmergencyAction;
}

export interface EmergencyAction {
  type: 'call_emergency' | 'call_poison_center' | 'visit_er' | 'call_doctor';
  message: string;
  phoneNumber?: string;
}

// ── UI State ──────────────────────────────────────────────────────────

export interface AppState {
  session: ChatSession;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  showEmergencyModal: boolean;
  emergencyAction: EmergencyAction | null;
}

// ── Safety ────────────────────────────────────────────────────────────

export interface SafetyCheckResult {
  level: SafetyLevel;
  triggeredKeywords: string[];
  emergencyAction?: EmergencyAction;
}

// ── Knowledge Base ────────────────────────────────────────────────────

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: 'medical' | 'software';
  tags: string[];
  reviewedAt: string;
  reviewedBy: string;
}
