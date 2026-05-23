
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}
