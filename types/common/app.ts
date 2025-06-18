import { Color } from './ui';

// 사용자 타입
export interface User {
  id: string;
  name: string;
  email: string;
}

// 테마 타입
export interface Theme {
  primaryColor: Color;
  secondaryColor: Color;
  backgroundColor: Color;
  textColor: Color;
}

// 환경 설정 타입
export interface AppSettings {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
} 