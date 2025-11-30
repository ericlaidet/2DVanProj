// apps/api/src/ai/types/ai.types.ts
export interface LayoutItem {
  type: 'bed' | 'kitchen' | 'storage' | 'bathroom' | 'table' | 'seat';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface LayoutSuggestion {
  layout: LayoutItem[];
  explanation: string;
  alternatives?: string[];
}

export interface UserPreferences {
  style: string;
  priorities: string[];
  patterns: {
    bed?: string;
    kitchen?: string;
    storage?: string;
    bathroom?: string;
  };
  recommendations: string;
}
