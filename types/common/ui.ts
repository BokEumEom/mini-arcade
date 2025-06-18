import { ReactNode } from 'react';

// 기본 컴포넌트 props 타입
export interface BaseComponentProps {
  children?: ReactNode;
  style?: object;
}

// 색상 타입
export type Color = string;

// 크기 타입
export type Size = 'small' | 'medium' | 'large';

// 방향 타입
export type Direction = 'horizontal' | 'vertical';

// 정렬 타입
export type Alignment = 'start' | 'center' | 'end' | 'stretch';

// 마진 및 패딩 타입
export interface Spacing {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

// 아이콘 타입
export interface IconProps {
  name: string;
  size?: number;
  color?: Color;
}

// 버튼 타입
export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// 입력 필드 타입
export interface InputProps extends BaseComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
} 