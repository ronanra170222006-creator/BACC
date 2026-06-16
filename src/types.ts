export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  plan: 'simple' | 'speciale' | null;
  refSms: string;
  status: 'pending' | 'validated';
}

export type SubjectCategory = 'Maths' | 'Physique-Chimie' | 'SVT' | 'Philosophie' | 'Histoire-Géo' | 'Malagasy' | 'Français';
export type BaccSeries = 'A1' | 'A2' | 'C' | 'D' | 'Toutes';

export interface BaccSubject {
  id: string;
  name: string;
  year: number;
  series: BaccSeries;
  category: SubjectCategory;
  isExclusive: boolean; // only for 'speciale' plan
  content: string; // Markdown content of the past exam or mock practice exam
  correctionHint?: string; // Guidance hint for teachers or students
}

export interface Lesson {
  id: string;
  title: string;
  category: SubjectCategory;
  content: string;
  series: BaccSeries[];
  keyPoints?: string[];
  keyFormulas?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  images?: string[]; // base64 representation of attached images
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}
