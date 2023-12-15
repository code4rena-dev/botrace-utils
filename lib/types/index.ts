export type Markdown = string;
export type LocUrl = string; // TODO: clarify format for v0.3

export interface Instance {
  content: Markdown | null;
  loc: LocUrl;
}

export interface Submission {
  severity: "High" | "Medium" | "Low" | "Gas" | "Refactoring" | "NonCritical" | "Disputed";
  title: Markdown;
  description: Markdown;
  gasSavings: number | null;
  category: string | null;
  instances: Instance[];
}

export interface Report {
  comment: Markdown | null;
  footnote: Markdown | null;
  findings: Submission[];
}