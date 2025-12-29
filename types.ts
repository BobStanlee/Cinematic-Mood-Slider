
export interface SlideData {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  mood: string;
}

export interface MoodConfig {
  name: string;
  label: string;
  promptPrefix: string;
  accentColor: string;
}

export enum NavigationDirection {
  NEXT = 'NEXT',
  PREV = 'PREV'
}
