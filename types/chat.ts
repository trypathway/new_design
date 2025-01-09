import { ApiResponse } from "./api";

export type ChatMode = "CompanyDocsV2" | "AnalysisV2" | "Generic";

export interface Chat {
  id: string;
  input: string;
  playbookId: string | null;
  playbookTitle: string | null;
  startedAt: string;
  finishedAt?: string;
  mode: ChatMode;
  suggestedQuestions?: string[];
  settings: Record<string, string>;
}

export interface GetChatsParams {
  page?: number;
  perPage?: number;
  companyId?: number;
}
