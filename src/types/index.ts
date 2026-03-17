export interface Category {
  code: string;
  name: string;
  emoji: string;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  type: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface UserProfile {
  name: string;
  email: string;
  org: string;
  isPro: boolean;
}

export interface Bookmark {
  id: number;
  title: string;
  description: string;
}
