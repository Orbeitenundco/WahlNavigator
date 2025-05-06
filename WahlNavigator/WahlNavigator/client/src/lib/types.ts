// Type definitions for the Wahl-O-Mat application

export interface Party {
  id: number;
  name: string;
  shortName: string;
  color: string;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
}

export interface PartyVote {
  partyId: number;
  partyName: string;
  vote: "agree" | "neutral" | "disagree";
}

export interface Question {
  id: number;
  title: string;
  description: string;
  topic: string;
  topicId: number;
  parliament: string;
  parliamentId: number;
  year: number;
  date: string;
  agreeText: string;
  disagreeText: string;
  partyVotes: PartyVote[];
  detailedInfo: string;
  sourceUrl: string;
  sourceDescription: string;
}

export interface Filter {
  timeFilter: string;
  levelFilters: {
    federal: boolean;
    state: boolean;
  };
  topicFilters: Record<string, boolean>;
}

export interface UserAnswer {
  questionId: number;
  answer: "agree" | "neutral" | "disagree" | "skip";
  importance: "low" | "medium" | "high";
}

export interface PartyMatch {
  partyId: number;
  partyName: string;
  partyColor: string;
  matchPercentage: number;
}

export interface ThematicResult {
  topic: string;
  partyResults: {
    partyName: string;
    matchPercentage: number;
  }[];
}

export interface KeyMatch {
  title: string;
  description: string;
}

export interface UserAnswerDetail {
  id: number;
  topic: string;
  title: string;
  parliament: string;
  year: number;
  userAnswer: string;
  importance: string;
  partyVotes: {
    partyId: number;
    partyName: string;
    partyColor: string;
    vote: string;
  }[];
}

export interface Results {
  partyMatches: PartyMatch[];
  thematicResults: ThematicResult[];
  keyMatches: KeyMatch[];
  userAnswersWithDetails: UserAnswerDetail[];
}
